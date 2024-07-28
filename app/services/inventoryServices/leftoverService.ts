import axios from 'axios';
import { Leftover, LeftoverItem } from '../../Schema/leftOverSchema';

let API_BASE_URL = "http://localhost:8000"

export const leftoverService = {
    fetchLeftovers: async (orderId: string) => {
        const response = await axios.get(`http://localhost:8000/leftovers/${orderId}`);
        return response.data.data;
    },

    postInventory: async (data: Leftover) => {
        const response = await axios.post('http://localhost:8000/leftovers', data);
        return response.data.data;
    },
    
    fetchLeftover: async (): Promise<Leftover[]> => {
        const response = await axios.get(`${API_BASE_URL}/leftovers`);
        return response.data;
      },
    
};
