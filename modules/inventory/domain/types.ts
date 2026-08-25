export type ItemCategory =
  | "raw_material"
  | "hardware"
  | "consumable"
  | "subassembly"
  | "finished_goods";

export type InventoryUnit = "EA" | "SHEET" | "FT" | "LBS" | "BOX";

export type TransactionType =
  | "receive"
  | "issue_to_job"
  | "return_from_job"
  | "move_location"
  | "cycle_count_adjustment"
  | "scrap"
  | "allocate";

export interface InventoryItem {
  id: string;
  organizationId: string;
  itemCode: string;
  description: string;
  category: ItemCategory;
  unitOfMeasure: InventoryUnit;
  defaultLocationCode: string;
  reorderPoint: number;
  reorderQuantity: number;
  standardCost: number;
  lotTrackingRequired: boolean;
  createdAt: string;
}

export interface InventoryTransaction {
  id: string;
  organizationId: string;
  transactionType: TransactionType;
  itemId: string;
  itemCode: string;
  lotNumber?: string;
  fromLocationCode?: string;
  toLocationCode?: string;
  jobId?: string;
  jobNumber?: string;
  quantityChange: number; // positive for additions, negative for deductions
  unitCost: number;
  actorUserId: string;
  actorName: string;
  idempotencyKey?: string;
  reason?: string;
  timestamp: string;
}

export interface ItemStockSummary {
  itemId: string;
  itemCode: string;
  description: string;
  category: ItemCategory;
  unitOfMeasure: InventoryUnit;
  totalOnHand: number;
  allocatedToJobs: number;
  availableToPromise: number;
  reorderPoint: number;
  isLowStock: boolean;
  totalValuation: number;
}
