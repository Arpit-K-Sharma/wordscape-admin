import axios from 'axios';
import { InventoryItem } from '@/app/Schema/inventorySchema';
import { InventoryResponse, TypeFormValues, StockFormValues } from '../../Schema/inventorySchema';


const BASE_URL = "http://localhost:8000"
interface ApiResponse<T> {
    status: string;
    data: T;
}

export const inventoryService = {
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
    
      createType: async (data: TypeFormValues): Promise<TypeFormValues> => {
        const response = await axios.post<TypeFormValues>(`${BASE_URL}/inventory`, data);
        return response.data;
      },
    
      addItem: async (itemId: string, data: StockFormValues): Promise<void> => {
        await axios.post(`${BASE_URL}/add-item/${itemId}`, data.items);
      },
    
      deleteType: async (typeId: string): Promise<{ status: string }> => {
        const response = await axios.delete<{ status: string }>(`${BASE_URL}/inventory/${typeId}`);
        return response.data;
      },
    
      deleteItem: async (typeId: string, itemId: string): Promise<{ status: string }> => {
        const response = await axios.delete<{ status: string }>(`${BASE_URL}/inventory/${typeId}/${itemId}`);
        return response.data;
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
