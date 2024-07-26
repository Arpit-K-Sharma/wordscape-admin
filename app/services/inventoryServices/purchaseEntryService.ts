import axios from 'axios';
import { PurchaseEntry, InventoryItem, Vendor, IssueItemsPayload } from '../../components/Schema/purchaseWithoutEntry';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const purchaseEntryService = {
  getPurchaseOrdersWithoutEntries: async (): Promise<PurchaseEntry[]> => {
    const response = await axios.get(`${API_BASE_URL}/purchase-orders-without-entries`);
    return response.data;
  },

  getInventoryItems: async (): Promise<InventoryItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/inventory-items`);
    return response.data;
  },

  getVendors: async (): Promise<Vendor[]> => {
    const response = await axios.get(`${API_BASE_URL}/vendors`);
    return response.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_BASE_URL}/upload-image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.filename;
  },

  createPurchaseEntry: async (orderId: string, data: any) => {
    return axios.post(`${API_BASE_URL}/purchase_entry/${orderId}`, data);
  },

  issueItems: async (payload: IssueItemsPayload) => {
    return axios.post(`${API_BASE_URL}/issued_item`, payload);
  },
};