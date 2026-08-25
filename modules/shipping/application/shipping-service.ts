import {
  ShippingManifest,
  ShipmentStop,
  ShippingMetricsSummary,
  CarrierType,
} from "../domain/types";
import { SessionContext } from "../../core/domain/types";
import { activityService } from "../../core/application/activity-service";
import { authorizationService } from "../../core/application/authorization-service";
import { notificationService } from "../../core/application/notification-service";
import { packagingService } from "../../packaging/application/packaging-service";

export class ShippingService {
  private manifests: Map<string, ShippingManifest> = new Map();

  constructor() {
    this.seedDefaultManifest("org_default");
  }

  private seedDefaultManifest(orgId: string) {
    const defaultManifest: ShippingManifest = {
      id: "shp_1",
      organizationId: orgId,
      manifestNumber: "BOL-2026-092",
      carrierType: "ltl_freight",
      carrierName: "Old Dominion Freight Line",
      trackingOrProNumber: "ODFL-88219044",
      driverName: "Marcus Vance",
      trailerOrPlateNumber: "TR-53-CO-9921",
      stops: [
        {
          stopSequence: 1,
          destinationCustomerName: "Alpine Aerospace Systems",
          destinationAddress: "7420 Innovation Way, Longmont, CO 80503",
          packageNumbers: ["PKG-2026-081"],
          status: "pending",
        },
      ],
      packageNumbers: ["PKG-2026-081"],
      totalPackages: 1,
      totalGrossWeightLbs: 45.0,
      status: "staged_for_loading",
      billOfLadingBarcode: "4twenty://bol/BOL-2026-092",
      createdAt: new Date().toISOString(),
    };

    this.manifests.set(`${orgId}:${defaultManifest.manifestNumber}`, defaultManifest);
  }

  private ensureManifestsSeeded(orgId: string) {
    const existing = Array.from(this.manifests.values()).filter((m) => m.organizationId === orgId);
    if (existing.length === 0) {
      this.seedDefaultManifest(orgId);
    }
  }

  // 1. Create Shipping Manifest (Draft Bill of Lading)
  createManifest(
    session: SessionContext,
    params: {
      carrierType: CarrierType;
      carrierName: string;
      trackingOrProNumber?: string;
      driverName?: string;
      trailerOrPlateNumber?: string;
      stops: Omit<ShipmentStop, "status" | "signedBy" | "deliveredAt">[];
    }
  ): ShippingManifest {
    authorizationService.requireCapability(session, "shipping:create_manifest");

    const orgId = session.activeOrganization.id;
    const count = Array.from(this.manifests.values()).filter((m) => m.organizationId === orgId).length + 1;
    const manifestNumber = `BOL-${new Date().getFullYear()}-${count.toString().padStart(3, "0")}`;
    const id = `shp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const stops: ShipmentStop[] = params.stops.map((s, idx) => ({
      ...s,
      stopSequence: s.stopSequence || idx + 1,
      status: "pending",
    }));

    const packageNumbers = stops.flatMap((s) => s.packageNumbers);

    const manifest: ShippingManifest = {
      id,
      organizationId: orgId,
      manifestNumber,
      carrierType: params.carrierType,
      carrierName: params.carrierName.trim(),
      trackingOrProNumber: params.trackingOrProNumber?.trim() || `PRO-${Date.now()}`,
      driverName: params.driverName?.trim(),
      trailerOrPlateNumber: params.trailerOrPlateNumber?.trim(),
      stops,
      packageNumbers,
      totalPackages: packageNumbers.length,
      totalGrossWeightLbs: 0,
      status: "draft_manifest",
      billOfLadingBarcode: `4twenty://bol/${manifestNumber}`,
      createdAt: now,
    };

    this.manifests.set(`${orgId}:${manifestNumber}`, manifest);

    activityService.logActivity({
      organizationId: orgId,
      actorId: session.user.id,
      actorName: session.user.name,
      entityType: "organization",
      entityId: id,
      action: "shipping.manifest_created",
      summary: `Created Bill of Lading ${manifestNumber} (${params.carrierName}, ${stops.length} delivery stops).`,
    });

    return manifest;
  }

  // 2. Assign Sealed Packages to Manifest (Verifies Package Readiness)
  assignPackages(
    session: SessionContext,
    manifestNumber: string,
    packageNumbers: string[]
  ): ShippingManifest {
    authorizationService.requireCapability(session, "shipping:create_manifest");

    const manifest = this.findManifest(session, manifestNumber);
    if (manifest.status === "dispatched_in_transit" || manifest.status === "delivered") {
      throw new Error(`Cannot assign packages to finalized manifest ${manifest.manifestNumber}.`);
    }

    // Verify all assigned packages exist and are in sealed_ready_for_shipping state
    const allPackages = packagingService.listPackages(session);
    let totalGross = 0;

    for (const pkgNum of packageNumbers) {
      const pkg = allPackages.find((p) => p.packageNumber === pkgNum);
      if (!pkg) {
        throw new Error(`Package ${pkgNum} not found in inventory.`);
      }
      if (pkg.status !== "sealed_ready_for_shipping") {
        throw new Error(
          `Packaging Readiness Violation: Package ${pkgNum} is not sealed (current status: ${pkg.status}). Only sealed packages can be assigned to shipments.`
        );
      }
      totalGross += pkg.grossWeightLbs;
    }

    manifest.packageNumbers = Array.from(new Set([...manifest.packageNumbers, ...packageNumbers]));
    manifest.totalPackages = manifest.packageNumbers.length;
    manifest.totalGrossWeightLbs = Math.round(totalGross * 10) / 10;
    manifest.status = "staged_for_loading";

    this.manifests.set(`${session.activeOrganization.id}:${manifest.manifestNumber}`, manifest);
    return manifest;
  }

  // 3. Dispatch Shipment (Generate BOL & Mark in Transit)
  dispatchShipment(
    session: SessionContext,
    manifestNumber: string,
    params?: { trackingOrProNumber?: string; driverName?: string; trailerOrPlateNumber?: string }
  ): ShippingManifest {
    authorizationService.requireCapability(session, "shipping:complete_shipment");

    const manifest = this.findManifest(session, manifestNumber);
    if (manifest.totalPackages === 0) {
      throw new Error(`Cannot dispatch empty manifest ${manifest.manifestNumber}.`);
    }

    const now = new Date().toISOString();
    manifest.status = "dispatched_in_transit";
    manifest.dispatchedAt = now;
    manifest.dispatchedByUserId = session.user.id;
    manifest.dispatchedByName = session.user.name;

    if (params?.trackingOrProNumber) manifest.trackingOrProNumber = params.trackingOrProNumber.trim();
    if (params?.driverName) manifest.driverName = params.driverName.trim();
    if (params?.trailerOrPlateNumber) manifest.trailerOrPlateNumber = params.trailerOrPlateNumber.trim();

    activityService.logActivity({
      organizationId: session.activeOrganization.id,
      actorId: session.user.id,
      actorName: session.user.name,
      entityType: "organization",
      entityId: manifest.id,
      action: "shipping.dispatched",
      summary: `Dispatched ${manifest.manifestNumber} with ${manifest.totalPackages} packages (${manifest.totalGrossWeightLbs} lbs) via ${manifest.carrierName}.`,
    });

    notificationService.dispatchNotification({
      organizationId: session.activeOrganization.id,
      recipientUserId: "logistics_manager",
      title: `Shipment Dispatched: ${manifest.manifestNumber}`,
      message: `${manifest.totalPackages} packages in transit via ${manifest.carrierName}. BOL: ${manifest.trackingOrProNumber}`,
      link: `/shipping?manifest=${manifest.manifestNumber}`,
    });

    this.manifests.set(`${session.activeOrganization.id}:${manifest.manifestNumber}`, manifest);
    return manifest;
  }

  // 4. Confirm Delivery (Idempotent Proof of Delivery)
  confirmDelivery(
    session: SessionContext,
    manifestNumber: string,
    stopSequence: number,
    signedBy: string
  ): ShippingManifest {
    authorizationService.requireCapability(session, "shipping:complete_shipment");

    const manifest = this.findManifest(session, manifestNumber);
    const stop = manifest.stops.find((s) => s.stopSequence === stopSequence);
    if (!stop) {
      throw new Error(`Delivery stop sequence #${stopSequence} not found on manifest.`);
    }

    // Idempotent delivery check
    if (stop.status === "delivered") {
      return manifest;
    }

    const now = new Date().toISOString();
    stop.status = "delivered";
    stop.signedBy = signedBy.trim();
    stop.deliveredAt = now;

    // If all stops delivered, finalize manifest status
    const allDelivered = manifest.stops.every((s) => s.status === "delivered");
    if (allDelivered) {
      manifest.status = "delivered";
      manifest.deliveredAt = now;
    }

    activityService.logActivity({
      organizationId: session.activeOrganization.id,
      actorId: session.user.id,
      actorName: session.user.name,
      entityType: "organization",
      entityId: manifest.id,
      action: "shipping.delivered",
      summary: `Stop #${stopSequence} delivered to ${stop.destinationCustomerName} (Signed by: ${stop.signedBy}).`,
    });

    this.manifests.set(`${session.activeOrganization.id}:${manifest.manifestNumber}`, manifest);
    return manifest;
  }

  // 5. Logistics Metrics
  getShippingMetrics(session: SessionContext): ShippingMetricsSummary {
    this.ensureManifestsSeeded(session.activeOrganization.id);
    const orgManifests = Array.from(this.manifests.values()).filter(
      (m) => m.organizationId === session.activeOrganization.id
    );

    const activeShipmentsCount = orgManifests.filter((m) => m.status === "dispatched_in_transit" || m.status === "staged_for_loading").length;
    const shipmentsDeliveredCount = orgManifests.filter((m) => m.status === "delivered").length;
    const inTransit = orgManifests.filter((m) => m.status === "dispatched_in_transit");
    const totalWeightInTransitLbs = inTransit.reduce((acc, m) => acc + m.totalGrossWeightLbs, 0);

    return {
      activeShipmentsCount,
      shipmentsDeliveredCount,
      totalWeightInTransitLbs: Math.round(totalWeightInTransitLbs * 10) / 10,
      onTimeDeliveryPercentage: 99.4,
    };
  }

  listManifests(session: SessionContext): ShippingManifest[] {
    this.ensureManifestsSeeded(session.activeOrganization.id);
    return Array.from(this.manifests.values()).filter(
      (m) => m.organizationId === session.activeOrganization.id
    );
  }

  private findManifest(session: SessionContext, idOrNumber: string): ShippingManifest {
    this.ensureManifestsSeeded(session.activeOrganization.id);
    const manifest = Array.from(this.manifests.values()).find(
      (m) =>
        (m.id === idOrNumber || m.manifestNumber === idOrNumber) &&
        m.organizationId === session.activeOrganization.id
    );
    if (!manifest) {
      throw new Error(`Shipping manifest '${idOrNumber}' not found.`);
    }
    return manifest;
  }
}

export const shippingService = new ShippingService();
