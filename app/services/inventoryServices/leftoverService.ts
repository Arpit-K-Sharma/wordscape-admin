import axios from "../../_axios/axiosInstance";

import { Leftover, LeftoverItem } from "../../Schema/leftOverSchema";

let API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const leftoverService = {
  fetchLeftovers: async (orderId: string) => {
    const response = await axios.get(`${API_BASE_URL}/leftovers/${orderId}`);
    return response.data.data;
  },

  postInventory: async (data: Leftover) => {
    const response = await axios.post(`${API_BASE_URL}/leftovers`, data);
    return response.data.data;
  },

  fetchLeftover: async (): Promise<Leftover[]> => {
    const response = await axios.get(`${API_BASE_URL}/leftovers`);
    return response.data;
  },
};
