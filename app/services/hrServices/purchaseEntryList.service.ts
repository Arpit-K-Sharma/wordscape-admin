import axios, { isAxiosError } from "../../_axios/axiosInstance";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface PurchaseEntry {
  _id: string;
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: PurchaseEntryVendor[];
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
}

export interface PurchaseEntryItem {
  itemId: string;
  quantityFromVendor: number;
  quantityFromStock: number;
  itemCode: string | null;
  rate: number | null;
  amount: number | null;
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

export interface CreatePurchaseEntryRequest {
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: Omit<PurchaseEntryVendor, "_id">[];
}

export const purchaseEntryService = {
  getPurchaseOrdersWithoutEntries: async (): Promise<PurchaseEntry[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/purchase_orders_without_entries`
      );
      if (response.data.status === "success") {
        return response.data.data;
      }
      throw new Error("Failed to fetch purchase orders");
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      throw error;
    }
  },

  getInventoryItems: async (): Promise<InventoryItem[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/inventory`);
      if (response.data.status === "success") {
        return response.data.data;
      }
      throw new Error("Failed to fetch inventory items");
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      throw error;
    }
  },

  getVendors: async (): Promise<Vendor[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/vendors`);
      if (response.data.status === "success") {
        return response.data.data;
      }
      throw new Error("Failed to fetch vendors");
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },

  createPurchaseEntry: async (
    data: CreatePurchaseEntryRequest
  ): Promise<PurchaseEntry> => {
    try {
      const response = await axios.post<PurchaseEntry>(
        `${BASE_URL}/purchase_entry`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message ||
            "An error occurred while creating the purchase entry"
        );
      } else {
        console.error("Error:", error);
        throw new Error("An unexpected error occurred");
      }
    }
  },
};
