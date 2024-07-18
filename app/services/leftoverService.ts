import axios from 'axios';
interface InventoryItem {
  _id: string;
  type: string;
  item: {
    _id: string;
    itemName: string;
    availability: number;
  }[];
}

interface InventoryResponse {
  data: InventoryItem[];
}

interface LeftoverItem {
  item_id: string;
  quantity: number;
  reason: string;
}

interface Leftover {
  _id: string;
  order_id: string;
  items: LeftoverItem[];
}

interface LeftoverFormProps {
  orderId: string;
  onSubmit: (data: any) => void;
}

const API_BASE_URL = 'http://localhost:8000';

export const leftoverService = {
  fetchLeftovers: async (orderId: string): Promise<Leftover[]> => {
    const response = await axios.get(`${API_BASE_URL}/leftovers/${orderId}`);
    return response.data;
  },

  fetchLeftover: async (): Promise<Leftover[]> => {
    const response = await axios.get(`${API_BASE_URL}/leftovers`);
    return response.data;
  },

  fetchInventory: async (): Promise<InventoryResponse> => {
    const response = await axios.get(`${API_BASE_URL}/inventory`);
    return response.data;
  },  

  postInventory: async (data: any): Promise<Leftover[]> => {
    const response = await axios.post(`${API_BASE_URL}/leftovers`, data);
    return response.data;
  }
}