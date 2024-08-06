import { InventoryItems } from "@/app/Schema/inventorySchema";
import axios from "../../_axios/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface ApprovedOrders {
  _id: string;
  date: string;
  customer: string;
  estimatedAmount: string;
  deadline: string;
  paperSize: string;
  pages: string;
  quantity: string;
  binding: string;
  innerPaper: string;
  innerPaperThickness: string;
  outerPaper: string;
  outerPaperThickness: string;
  innerLamination: string;
  outerLamination: string;
  inkType: string;
  deliveryOption: string;
  status: string;
  purchase_order_created: boolean | null;
}

export interface User {
  fullName: string;
}

export interface Paper {
  paperType: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  fullName: string;
}

export const dashboardService = {
  fetch_approved_orders: async (): Promise<ApprovedOrders[]> => {
    try {
      const response = await axios.get<ApiResponse<ApprovedOrders[]>>(
        `${BASE_URL}/get/approved_orders`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  },

  fetch_user: async (customer: string): Promise<User> => {
    try {
      const response = await axios.get<ApiResponse<User>>(
        `${BASE_URL}/get/user/${customer}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  },

  fetch_paper: async (type: string): Promise<Paper> => {
    try {
      const response = await axios.get<ApiResponse<Paper>>(
        `${BASE_URL}/get/paper/${type}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  },
  fetch_inventory_items: async (): Promise<InventoryItems[]> => {
    try {
      const response = await axios.get<ApiResponse<InventoryItems[]>>(
        `${BASE_URL}/inventory`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      throw error;
    }
  },
};
