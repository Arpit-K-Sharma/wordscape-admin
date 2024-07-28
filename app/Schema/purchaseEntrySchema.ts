import * as z from "zod";

export const itemSchema = z.object({
  inventoryId: z.string(),
  itemId: z.string(),
  quantityFromVendor: z.number(),
  quantityFromStock: z.number(),
});

export const purchaseEntrySchema = z.object({
  vendorId: z.string(),
  isCompleted: z.boolean().default(false),
  items: z.array(itemSchema),
});

export const formSchema = z.object({
  orderId: z.string(),
  isCompleted: z.boolean().default(false),
  purchaseEntry: z.array(purchaseEntrySchema),
  remarks: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

export interface ApprovedOrders {
  _id: string;
}

export interface Item {
  _id: string;
  itemName: string;
  availability: number;
}

export interface Inventory {
  type: string;
  _id: string;
  item: Item[];
}

export interface PurchaseEntrySlipProps {
  orderId: string;
  isReorder?: boolean;
}


export interface PurchaseEntry {
  orderId: string;
  purchaseEntry: PurchaseEntryVendor[];
}

export interface PurchaseEntryVendor {
  _id: string;
  vendorId: string;
  items: PurchaseEntryItem[];
}

export interface PurchaseEntryItem {
  inventoryId: string;
  itemId: string;
  quantityFromVendor: number;
}

export interface InventoryItem {
  _id: string;
  item: Item[];
}

export interface Item {
  _id: string;
  itemName: string;
}

export interface Vendor {
  _id: string;
  vendorName: string;
}

export interface IssueItemsPayload {
  order_id: string;
  approved_by: string;
  issued_date: string;
}

export interface VendorInput {
  invoiceNo: string;
  invoiceDate: string;
  grandTotal: string;
  vat: string;
  discount: string;
  image: string;
  items: { rate: string; code: string; amount: string }[];
}