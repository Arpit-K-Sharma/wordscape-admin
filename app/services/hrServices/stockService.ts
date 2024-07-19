import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

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

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const stockService = {
  fetchInventory: async (): Promise<ApiResponse<InventoryItem[]>> => {
    try {
      const response = await axios.get<ApiResponse<InventoryItem[]>>(
        `${BASE_URL}/inventory`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  },

  createInventoryItem: async (data: {
    itemName: string;
    availability: string;
  }): Promise<InventoryItem> => {
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
  },

  deleteType: async (typeId: string): Promise<{ status: string }> => {
    try {
      const response = await axios.delete<{ status: string }>(
        `${BASE_URL}/inventory/${typeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error occurred while deleting the item type:", error);
      throw error;
    }
  },

  deleteItem: async (
    typeId: string,
    itemId: string
  ): Promise<{ status: string }> => {
    try {
      const response = await axios.delete<{ status: string }>(
        `${BASE_URL}/inventory/${typeId}/${itemId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error occurred while deleting the item:", error);
      throw error;
    }
  },
};
