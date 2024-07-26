export interface PurchaseEntryItem {
    itemId: string;
    inventoryId: string;
    quantityFromVendor: number;
    quantityFromStock: number;
    itemCode: string | null;
    rate: number | null;
    amount: number | null;
  }
  
  export interface PurchaseEntryVendor {
    _id: string;
    vendorId: string;
    isCompleted: boolean;
    items: PurchaseEntryItem[];
    tag: string | null;
    remarks: string | null;
    image: string | null;
    discount: number | null;
    vat: number | null;
    grandTotal: number | null;
    invoiceNo: string | null;
    invoiceDate: string | null;
    is_issued: boolean | null;
  }
  
  export interface PurchaseEntry {
    _id: string;
    orderId: string;
    isCompleted: boolean;
    purchaseEntry: PurchaseEntryVendor[];
  }
  
  export interface Item {
    _id: string;
    itemName: string;
    availability: number;
  }
  
  export interface InventoryItem {
    _id: string;
    type: string;
    item: Item[];
  }
  
  export interface Vendor {
    _id: string;
    vendorName: string;
    vendorAddress: string;
    vendorVAT: string;
    vendorPhone: string;
  }
  
  export interface IssueItemsPayload {
    order_id: string;
    approved_by: string;
    issued_date: string;
  }