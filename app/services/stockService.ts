import axios from 'axios';

const BASE_URL = "http://localhost:8000";


interface Item {
    _id: string;
    itemName: string;
    availability: number;
  }
  
  interface InventoryItem {
    _id: string;
    type: string;
    item: Item[];
  }

interface ApiResponse<> {
    status: string;
    data: InventoryItem[];
}

export const stockService = {
    fetchInventory: async (): Promise<InventoryItem[]> => {
        try {
            const response = await axios.get<InventoryItem[]>(
              `${BASE_URL}/inventory`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching data: ", error);
            throw error;
        }
    },

    createInventoryItem: async (data: { itemName: string; availability: string}): Promise<InventoryItem> => {
        try {
            const response = await axios.post<InventoryItem>(
              `${BASE_URL}/inventory/`,
              data
            );
            return response.data;
        } catch (error) {
            console.error("Error occurred while creating an inventory item:", error);
            throw error;
        }
    }
};