import axios from "axios";
import {
  PurchaseEntry,
  InventoryItem,
  Vendor,
  IssueItemsPayload,
} from "../../Schema/purchaseWithoutEntry";
import { FormSchema } from "../../Schema/purchaseEntrySchema";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const purchaseEntryService = {
  getPurchaseOrders: async (): Promise<PurchaseEntry[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/purchase_orders_with_entries`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      throw error;
    }
  },
  createPurchaseEntry: async (orderId: string, data: any) => {
    return axios.post(`${API_BASE_URL}/purchase_entry/${orderId}`, data);
  },

  getPurchaseOrdersWithoutEntries: async (): Promise<PurchaseEntry[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/purchase_orders_without_entries`
    );
    return response.data.data;
  },

  createReorder: async (orderId: string, data: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reOrder/${orderId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating reorder:", error);
      throw error;
    }
  },

  createPurchaseOrder: async (data: FormSchema) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/purchase_order`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating purchase entry:", error);
      throw error;
    }
  },

  getPurchaseEntries: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/purchaseEntries`);
      return response.data;
    } catch (error) {
      console.error("Error fetching purchase entries:", error);
      throw error;
    }
  },

  getInventoryItems: async (): Promise<InventoryItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/inventory`);
    return response.data.data;
  },

  getVendors: async (): Promise<Vendor[]> => {
    const response = await axios.get(`${API_BASE_URL}/vendors`);
    return response.data.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_BASE_URL}/upload-image/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.filename;
  },

  getItems: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  },

  issueItems: async (payload: IssueItemsPayload) => {
    return axios.post(`${API_BASE_URL}/issued_item`, payload);
  },
};
