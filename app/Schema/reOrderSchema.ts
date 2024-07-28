export interface Item {
    inventoryId: string
    itemId: string
    quantityFromVendor: number
    quantityFromStock: number
    itemCode: string | null
    rate: number | null
    amount: number | null
  }
  
  export interface PurchaseEntry {
    _id: string | null
    vendorId: string
    isCompleted: boolean
    items: Item[]
    tag: string
    remarks: string
    image: string | null
    discount: number | null
    vat: number | null
    grandTotal: number | null
    invoiceNo: string | null
    invoiceDate: string | null
  }
  
  export interface PurchaseOrder {
    _id: string | null
    orderId: string
    isCompleted: boolean
    purchaseEntry: PurchaseEntry[]
  }
  
  export interface Vendor {
    _id: string
    vendorName: string
  }
  export interface Items {
    _id: string,
    itemName: string
  }
  
  export interface InventoryItem {
    _id: string
    type: string
    item: Items[]
  }
  
  export interface ApiResponse {
    status: string
    status_code: number
    data: PurchaseOrder[]
  }