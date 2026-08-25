import {
  PackagingUnit,
  PackagedItem,
  PackagingMetricsSummary,
  ContainerType,
} from "../domain/types";
import { SessionContext } from "../../core/domain/types";
import { activityService } from "../../core/application/activity-service";
import { authorizationService } from "../../core/application/authorization-service";

export class PackagingService {
  private packages: Map<string, PackagingUnit> = new Map();

  constructor() {
    this.seedDefaultPackages("org_default");
  }

  private seedDefaultPackages(orgId: string) {
    const pkg: PackagingUnit = {
      id: "pkg_1",
      organizationId: orgId,
      packageNumber: "PKG-2026-081",
      containerType: "box",
      items: [
        {
          id: "pi_1",
          jobId: "job_104",
          jobNumber: "JOB-2026-104",
          partDescription: "Precision Laser Cut Flanges - 0.25in 304 SS",
          quantityPacked: 50,
          unitWeightLbs: 0.85,
          lotNumber: "LOT-2026-SS1",
        },
      ],
      totalQuantity: 50,
      netWeightLbs: 42.5,
      tareWeightLbs: 2.5,
      grossWeightLbs: 45.0,
      maxCapacityLbs: 70.0,
      dimensionsInches: { length: 18, width: 14, height: 10 },
      labelBarcode: "4twenty://package/PKG-2026-081",
      status: "sealed_ready_for_shipping",
      sealedAt: new Date().toISOString(),
      sealedByUserId: "usr_pack",
      sealedByName: "Packaging Tech",
      createdAt: new Date().toISOString(),
    };

    this.packages.set(`${orgId}:${pkg.packageNumber}`, pkg);
  }

  private ensurePackagesSeeded(orgId: string) {
    const existing = Array.from(this.packages.values()).filter((p) => p.organizationId === orgId);
    if (existing.length === 0) {
      this.seedDefaultPackages(orgId);
    }
  }

  // 1. Create Packaging Unit (Box / Pallet / Crate)
  createPackagingUnit(
    session: SessionContext,
    params: {
      containerType: ContainerType;
      maxCapacityLbs?: number;
      tareWeightLbs?: number;
      dimensionsInches?: { length: number; width: number; height: number };
    }
  ): PackagingUnit {
    authorizationService.requireCapability(session, "shopfloor:execute_station");

    const orgId = session.activeOrganization.id;
    const pkgCount = Array.from(this.packages.values()).filter((p) => p.organizationId === orgId).length + 1;
    const prefix = params.containerType === "pallet" ? "PALLET" : params.containerType === "crate" ? "CRATE" : "PKG";
    const packageNumber = `${prefix}-${new Date().getFullYear()}-${pkgCount.toString().padStart(3, "0")}`;
    const id = `pkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const maxCapacity = params.maxCapacityLbs || (params.containerType === "pallet" ? 2200 : params.containerType === "crate" ? 1200 : 70);
    const tareWeight = params.tareWeightLbs || (params.containerType === "pallet" ? 40 : params.containerType === "crate" ? 35 : 2.5);
    const dimensions = params.dimensionsInches || (params.containerType === "pallet" ? { length: 48, width: 40, height: 48 } : { length: 18, width: 14, height: 10 });

    const unit: PackagingUnit = {
      id,
      organizationId: orgId,
      packageNumber,
      containerType: params.containerType,
      items: [],
      totalQuantity: 0,
      netWeightLbs: 0,
      tareWeightLbs: tareWeight,
      grossWeightLbs: tareWeight,
      maxCapacityLbs: maxCapacity,
      dimensionsInches: dimensions,
      labelBarcode: `4twenty://package/${packageNumber}`,
      status: "in_pack",
      createdAt: now,
    };

    this.packages.set(`${orgId}:${packageNumber}`, unit);

    activityService.logActivity({
      organizationId: orgId,
      actorId: session.user.id,
      actorName: session.user.name,
      entityType: "organization",
      entityId: id,
      action: "packaging.unit_created",
      summary: `Created ${params.containerType.toUpperCase()} container ${packageNumber} (Max: ${maxCapacity} lbs).`,
    });

    return unit;
  }

  // 2. Pack Item into Container with Capacity Guardrail
  packItem(
    session: SessionContext,
    packageNumber: string,
    item: {
      jobId: string;
      jobNumber: string;
      partDescription: string;
      quantity: number;
      unitWeightLbs: number;
      lotNumber?: string;
    }
  ): PackagingUnit {
    authorizationService.requireCapability(session, "shopfloor:execute_station");

    const pkg = this.findPackage(session, packageNumber);
    if (pkg.status === "sealed_ready_for_shipping") {
      throw new Error(`Cannot add items to sealed container ${pkg.packageNumber}.`);
    }

    const itemTotalWeight = item.quantity * item.unitWeightLbs;
    const projectedGross = pkg.grossWeightLbs + itemTotalWeight;

    // Capacity Constraint Violation Guardrail
    if (projectedGross > pkg.maxCapacityLbs) {
      throw new Error(
        `Capacity Violation: Adding ${itemTotalWeight} lbs would result in gross weight ${projectedGross} lbs, exceeding maximum container capacity of ${pkg.maxCapacityLbs} lbs.`
      );
    }

    const packagedItem: PackagedItem = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobId: item.jobId,
      jobNumber: item.jobNumber,
      partDescription: item.partDescription.trim(),
      quantityPacked: item.quantity,
      unitWeightLbs: item.unitWeightLbs,
      lotNumber: item.lotNumber?.trim().toUpperCase(),
    };

    pkg.items.push(packagedItem);
    pkg.totalQuantity += item.quantity;
    pkg.netWeightLbs = Math.round((pkg.netWeightLbs + itemTotalWeight) * 10) / 10;
    pkg.grossWeightLbs = Math.round((pkg.tareWeightLbs + pkg.netWeightLbs) * 10) / 10;

    this.packages.set(`${session.activeOrganization.id}:${pkg.packageNumber}`, pkg);
    return pkg;
  }

  // 3. Seal Packaging Unit & Mark Ready for Shipping
  sealPackagingUnit(session: SessionContext, packageNumber: string): PackagingUnit {
    authorizationService.requireCapability(session, "shopfloor:execute_station");

    const pkg = this.findPackage(session, packageNumber);
    if (pkg.items.length === 0) {
      throw new Error(`Cannot seal empty container ${pkg.packageNumber}.`);
    }

    const now = new Date().toISOString();
    pkg.status = "sealed_ready_for_shipping";
    pkg.sealedAt = now;
    pkg.sealedByUserId = session.user.id;
    pkg.sealedByName = session.user.name;

    activityService.logActivity({
      organizationId: session.activeOrganization.id,
      actorId: session.user.id,
      actorName: session.user.name,
      entityType: "job",
      entityId: pkg.items[0].jobId,
      action: "packaging.unit_sealed",
      summary: `Container ${pkg.packageNumber} sealed (${pkg.totalQuantity} pcs, ${pkg.grossWeightLbs} lbs). Ready for shipping manifest.`,
    });

    this.packages.set(`${session.activeOrganization.id}:${pkg.packageNumber}`, pkg);
    return pkg;
  }

  // 4. Metrics & Lookups
  getPackagingMetrics(session: SessionContext): PackagingMetricsSummary {
    this.ensurePackagesSeeded(session.activeOrganization.id);
    const orgPackages = Array.from(this.packages.values()).filter(
      (p) => p.organizationId === session.activeOrganization.id
    );

    const activePackagesCount = orgPackages.filter((p) => p.status === "in_pack").length;
    const readyForShipmentCount = orgPackages.filter((p) => p.status === "sealed_ready_for_shipping").length;
    const totalWeightPackedLbs = orgPackages.reduce((acc, p) => acc + p.grossWeightLbs, 0);

    return {
      activePackagesCount,
      readyForShipmentCount,
      totalWeightPackedLbs: Math.round(totalWeightPackedLbs * 10) / 10,
    };
  }

  listPackages(session: SessionContext): PackagingUnit[] {
    this.ensurePackagesSeeded(session.activeOrganization.id);
    return Array.from(this.packages.values()).filter(
      (p) => p.organizationId === session.activeOrganization.id
    );
  }

  private findPackage(session: SessionContext, packageNumberOrId: string): PackagingUnit {
    this.ensurePackagesSeeded(session.activeOrganization.id);
    const pkg = Array.from(this.packages.values()).find(
      (p) =>
        (p.id === packageNumberOrId || p.packageNumber === packageNumberOrId) &&
        p.organizationId === session.activeOrganization.id
    );
    if (!pkg) {
      throw new Error(`Packaging container '${packageNumberOrId}' not found.`);
    }
    return pkg;
  }
}

export const packagingService = new PackagingService();
