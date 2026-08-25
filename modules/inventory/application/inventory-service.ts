import {
  InventoryItem,
  InventoryTransaction,
  ItemStockSummary,
  ItemCategory,
  InventoryUnit,
} from "../domain/types";
import { SessionContext } from "../../core/domain/types";
import { activityService } from "../../core/application/activity-service";
import { authorizationService } from "../../core/application/authorization-service";

export class InventoryService {
  private items: Map<string, InventoryItem> = new Map();
  private transactions: InventoryTransaction[] = [];

  constructor() {
    this.seedDefaultItems("org_default");
  }

  private seedDefaultItems(orgId: string) {
    const defaultItems: Omit<InventoryItem, "organizationId">[] = [
      {
        id: "item_1",
        itemCode: "ALUM-6061-0.25-48X96",
        description: "6061-T6 Aluminum Sheet 0.250in x 48in x 96in",
        category: "raw_material",
        unitOfMeasure: "SHEET",
        defaultLocationCode: "RACK-A-01",
        reorderPoint: 5,
        reorderQuantity: 20,
        standardCost: 185.0,
        lotTrackingRequired: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "item_2",
        itemCode: "SS-304-14GA-48X120",
        description: "304 Stainless Steel Sheet 14GA 2B Finish",
        category: "raw_material",
        unitOfMeasure: "SHEET",
        defaultLocationCode: "RACK-B-03",
        reorderPoint: 8,
        reorderQuantity: 25,
        standardCost: 215.0,
        lotTrackingRequired: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "item_3",
        itemCode: "FAST-M6-FLANGE-SS",
        description: "M6-1.00 x 20mm Serrated Flange Bolt 316 SS",
        category: "hardware",
        unitOfMeasure: "EA",
        defaultLocationCode: "BIN-C-12",
        reorderPoint: 200,
        reorderQuantity: 1000,
        standardCost: 0.45,
        lotTrackingRequired: false,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const item of defaultItems) {
      this.items.set(`${orgId}:${item.itemCode}`, { ...item, organizationId: orgId });
    }
  }

  // 1. Create Catalog Item
  createItem(
    session: SessionContext,
    params: {
      itemCode: string;
      description: string;
      category: ItemCategory;
      unitOfMeasure: InventoryUnit;
      defaultLocationCode: string;
      reorderPoint: number;
      reorderQuantity: number;
      standardCost: number;
      lotTrackingRequired?: boolean;
    }
  ): InventoryItem {
    authorizationService.requireCapability(session, "inventory:adjust_count");

    const codeUpper = params.itemCode.trim().toUpperCase();
    const existing = Array.from(this.items.values()).find(
      (i) => i.organizationId === session.activeOrganization.id && i.itemCode === codeUpper
    );
    if (existing) {
      throw new Error(`Item code '${codeUpper}' already exists.`);
    }

    const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const item: InventoryItem = {
      id,
      organizationId: session.activeOrganization.id,
      itemCode: codeUpper,
      description: params.description.trim(),
      category: params.category,
      unitOfMeasure: params.unitOfMeasure,
      defaultLocationCode: params.defaultLocationCode.trim().toUpperCase(),
      reorderPoint: params.reorderPoint,
      reorderQuantity: params.reorderQuantity,
      standardCost: params.standardCost,
      lotTrackingRequired: params.lotTrackingRequired || false,
      createdAt: new Date().toISOString(),
    };

    this.items.set(id, item);
    return item;
  }

  // 2. Receive Material (+Qty)
  receiveMaterial(
    session: SessionContext,
    params: {
      itemId: string;
      quantity: number;
      lotNumber?: string;
      toLocationCode?: string;
      unitCost?: number;
      idempotencyKey?: string;
    }
  ): InventoryTransaction {
    authorizationService.requireCapability(session, "inventory:receive_material");

    if (params.quantity <= 0) {
      throw new Error("Receive quantity must be positive.");
    }

    // Idempotency check
    if (params.idempotencyKey) {
      const existing = this.transactions.find(
        (t) => t.organizationId === session.activeOrganization.id && t.idempotencyKey === params.idempotencyKey
      );
      if (existing) return existing;
    }

    const item = this.findItem(session, params.itemId);
    const now = new Date().toISOString();

    const tx: InventoryTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: session.activeOrganization.id,
      transactionType: "receive",
      itemId: item.id,
      itemCode: item.itemCode,
      lotNumber: params.lotNumber?.trim().toUpperCase(),
      toLocationCode: params.toLocationCode || item.defaultLocationCode,
      quantityChange: params.quantity,
      unitCost: params.unitCost ?? item.standardCost,
      actorUserId: session.user.id,
      actorName: session.user.name,
      idempotencyKey: params.idempotencyKey,
      timestamp: now,
    };

    this.transactions.push(tx);

    activityService.logActivity({
      organizationId: session.activeOrganization.id,
      actorId: session.user.id,
      actorName: session.user.name,
      entityType: "organization",
      entityId: item.id,
      action: "inventory.received",
      summary: `Received +${params.quantity} ${item.unitOfMeasure} of ${item.itemCode} (Lot: ${params.lotNumber || "N/A"}).`,
    });

    return tx;
  }

  // 3. Issue to Job (-Qty, enforces Negative Stock Policy)
  issueToJob(
    session: SessionContext,
    params: {
      itemId: string;
      jobId: string;
      jobNumber: string;
      quantity: number;
      lotNumber?: string;
      fromLocationCode?: string;
    }
  ): InventoryTransaction {
    authorizationService.requireCapability(session, "inventory:adjust_count");

    if (params.quantity <= 0) {
      throw new Error("Issue quantity must be positive.");
    }

    const item = this.findItem(session, params.itemId);
    const summary = this.getItemStockSummary(session, item.id);

    // Negative Stock Guardrail Policy
    if (summary.totalOnHand < params.quantity) {
      throw new Error(
        `Negative Stock Policy Violation: Cannot issue ${params.quantity} ${item.unitOfMeasure}. Only ${summary.totalOnHand} available on-hand.`
      );
    }

    const now = new Date().toISOString();
    const tx: InventoryTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: session.activeOrganization.id,
      transactionType: "issue_to_job",
      itemId: item.id,
      itemCode: item.itemCode,
      lotNumber: params.lotNumber?.trim().toUpperCase(),
      jobId: params.jobId,
      jobNumber: params.jobNumber,
      fromLocationCode: params.fromLocationCode || item.defaultLocationCode,
      quantityChange: -params.quantity,
      unitCost: item.standardCost,
      actorUserId: session.user.id,
      actorName: session.user.name,
      timestamp: now,
    };

    this.transactions.push(tx);

    activityService.logActivity({
      organizationId: session.activeOrganization.id,
      actorId: session.user.id,
      actorName: session.user.name,
      entityType: "job",
      entityId: params.jobId,
      action: "inventory.issued",
      summary: `Issued ${params.quantity} ${item.unitOfMeasure} of ${item.itemCode} to job ${params.jobNumber}.`,
    });

    return tx;
  }

  // 4. Return from Job (+Qty)
  returnFromJob(
    session: SessionContext,
    params: {
      itemId: string;
      jobId: string;
      jobNumber: string;
      quantity: number;
      reason?: string;
    }
  ): InventoryTransaction {
    authorizationService.requireCapability(session, "inventory:adjust_count");

    const item = this.findItem(session, params.itemId);
    const now = new Date().toISOString();

    const tx: InventoryTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: session.activeOrganization.id,
      transactionType: "return_from_job",
      itemId: item.id,
      itemCode: item.itemCode,
      jobId: params.jobId,
      jobNumber: params.jobNumber,
      toLocationCode: item.defaultLocationCode,
      quantityChange: params.quantity,
      unitCost: item.standardCost,
      actorUserId: session.user.id,
      actorName: session.user.name,
      reason: params.reason || "Excess unused material returned from job floor.",
      timestamp: now,
    };

    this.transactions.push(tx);
    return tx;
  }

  // 5. Cycle Count Adjustment
  adjustCycleCount(
    session: SessionContext,
    params: {
      itemId: string;
      countedQuantity: number;
      varianceReason: string;
    }
  ): InventoryTransaction {
    authorizationService.requireCapability(session, "inventory:adjust_count");

    if (params.countedQuantity < 0) {
      throw new Error("Counted quantity cannot be negative.");
    }

    const item = this.findItem(session, params.itemId);
    const summary = this.getItemStockSummary(session, item.id);
    const variance = params.countedQuantity - summary.totalOnHand;

    if (variance === 0) {
      throw new Error("Count matches current on-hand ledger balance. No adjustment needed.");
    }

    const now = new Date().toISOString();
    const tx: InventoryTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: session.activeOrganization.id,
      transactionType: "cycle_count_adjustment",
      itemId: item.id,
      itemCode: item.itemCode,
      quantityChange: variance,
      unitCost: item.standardCost,
      actorUserId: session.user.id,
      actorName: session.user.name,
      reason: params.varianceReason.trim(),
      timestamp: now,
    };

    this.transactions.push(tx);
    return tx;
  }

  // 6. Compute Stock Summaries Strictly from Transaction Ledger
  getItemStockSummary(session: SessionContext, itemId: string): ItemStockSummary {
    const item = this.findItem(session, itemId);
    const itemTxs = this.transactions.filter(
      (t) => t.organizationId === session.activeOrganization.id && t.itemId === item.id
    );

    let onHand = 0;
    for (const tx of itemTxs) {
      onHand += tx.quantityChange;
    }

    const allocated = 0; // Derived from active work order allocations
    const available = Math.max(0, onHand - allocated);

    return {
      itemId: item.id,
      itemCode: item.itemCode,
      description: item.description,
      category: item.category,
      unitOfMeasure: item.unitOfMeasure,
      totalOnHand: onHand,
      allocatedToJobs: allocated,
      availableToPromise: available,
      reorderPoint: item.reorderPoint,
      isLowStock: onHand <= item.reorderPoint,
      totalValuation: onHand * item.standardCost,
    };
  }

  listStock(session: SessionContext): ItemStockSummary[] {
    const orgItems = Array.from(this.items.values()).filter(
      (i) => i.organizationId === session.activeOrganization.id
    );

    return orgItems.map((item) => this.getItemStockSummary(session, item.id));
  }

  private findItem(session: SessionContext, itemId: string): InventoryItem {
    const item = Array.from(this.items.values()).find(
      (i) => (i.id === itemId || i.itemCode === itemId) && i.organizationId === session.activeOrganization.id
    );
    if (!item) {
      throw new Error(`Inventory item '${itemId}' not found in active organization.`);
    }
    return item;
  }
}

export const inventoryService = new InventoryService();
