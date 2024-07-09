import axios from "axios";

const BASE_URL = "http://localhost:8000";

export interface PurchaseOrderItem {
  itemId: string;
  quantityFromVendor: number;
  quantityFromStock: number;
}

export interface PurchaseEntry {
  vendorId: string;
  isCompleted: boolean;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrder {
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: PurchaseEntry[];
}

export interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

export interface Item {
  _id: string;
  itemName: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const purchaseEntryService = {
  createPurchaseEntry: async (data: PurchaseOrder): Promise<PurchaseOrder> => {
    try {
      const response = await axios.post<ApiResponse<PurchaseOrder>>(
        `${BASE_URL}/purchase_order`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating purchase entry:", error);
      throw error;
    }
  },

  getPurchaseEntries: async (): Promise<PurchaseOrder[]> => {
    try {
      const response = await axios.get<ApiResponse<PurchaseOrder[]>>(
        `${BASE_URL}/purchase_orders`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching purchase entries:", error);
      throw error;
    }
  },

  getVendors: async (): Promise<Vendor[]> => {
    try {
      const response = await axios.get<ApiResponse<Vendor[]>>(
        `${BASE_URL}/vendors`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },

  getItems: async (): Promise<Item[]> => {
    try {
      const response = await axios.get<ApiResponse<Item[]>>(
        `${BASE_URL}/inventory`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  },
};
