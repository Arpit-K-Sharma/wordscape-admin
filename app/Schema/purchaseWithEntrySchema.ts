export interface PurchaseOrderItem {
    itemId: string;
    quantityFromVendor: number;
    quantityFromStock: number;
    itemCode: string | null;
    rate: number | null;
    amount: number | null;
  }
  
  export interface PurchaseEntry {
    _id: string;
    vendorId: string;
    isCompleted: boolean;
    items: PurchaseOrderItem[];
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
  
  export interface PurchaseOrder {
    _id: string;
    orderId: string;
    isCompleted: boolean;
    purchaseEntry: PurchaseEntry[];
  }
  
  export interface Items {
    _id: string;
    itemName: string;
    availability: number;
  }
  
  export interface InventoryItem {
    _id: string;
    type: string;
    item: Items[];
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