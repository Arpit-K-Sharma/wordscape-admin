import axios from 'axios';

// Interfaces
interface Item {
    inventoryId: string
    itemId: string
    quantityFromVendor: number
    quantityFromStock: number
    itemCode: string | null
    rate: number | null
    amount: number | null
  }
  
  interface PurchaseEntry {
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
  
  interface PurchaseOrder {
    _id: string | null
    orderId: string
    isCompleted: boolean
    purchaseEntry: PurchaseEntry[]
  }
  
  interface Vendor {
    _id: string
    vendorName: string
  }
  interface Items {
    _id: string,
    itemName: string
  }
  
  interface InventoryItem {
    _id: string
    type: string
    item: Items[]
  }
  

interface ApiResponse<T> {
  status: string;
  status_code: number;
  data: T;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

export const reorderService = {
  getReorders: async (): Promise<PurchaseOrder[]> => {
    try {
      const response = await axios.get<ApiResponse<PurchaseOrder[]>>(`${API_BASE_URL}/reorders`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching reorders:", error);
      throw error;
    }
  },

  getVendors: async (): Promise<Vendor[]> => {
    try {
      const response = await axios.get<{ data: Vendor[] }>(`${API_BASE_URL}/vendors`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },

  getInventoryItems: async (): Promise<InventoryItem[]> => {
    try {
      const response = await axios.get<{ data: InventoryItem[] }>(`${API_BASE_URL}/inventory`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      throw error;
    }
  },

  createReorder: async (reorderData: Omit<PurchaseOrder, '_id'>): Promise<PurchaseOrder> => {
    try {
      const response = await axios.post<{ data: PurchaseOrder }>(`${API_BASE_URL}/reorders`, reorderData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating reorder:", error);
      throw error;
    }
  },



};

export default reorderService;