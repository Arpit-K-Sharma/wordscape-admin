import axios from 'axios';

const BASE_URL = "http://localhost:8000";

export interface InventoryItem {
    _id: string;
    itemName: string;
    availability: string;
    type: string;
}

interface ApiResponse<T> {
    status: string;
    data: T;
    item_name: string;
    availability: string;
    type: string;
}

export const stockService = {
    fetchInventory: async (): Promise<InventoryItem[]> => {
        try {
            const response = await axios.get<ApiResponse<InventoryItem[]>>(
              `${BASE_URL}/inventory`
            );
            return response.data.data;
        } catch (error) {
            console.error("Error fetching data: ", error);
            throw error;
        }
    },

    createInventoryItem: async (data: { itemName: string; availability: string; type: string }): Promise<InventoryItem> => {
        try {
            const response = await axios.post<InventoryItem>(
              `${BASE_URL}/inventory`,
              data
            );
            return response.data;
        } catch (error) {
            console.error("Error occurred while creating an inventory item:", error);
            throw error;
        }
    }
};