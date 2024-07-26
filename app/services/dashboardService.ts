
import axios from "axios";
import { ApprovedOrders, User, Cover, Paper, ApiResponse, InventoryItem } from "../components/Schema/dashboardSchema" 

const BASE_URL = "http://localhost:8000";

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

    fetch_cover_treatment: async (type: string): Promise<Cover> => {
        try {
            const response = await axios.get<ApiResponse<Cover>>(
                `${BASE_URL}/get/coverTreatment/${type}`
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

    fetch_inventory_items: async (): Promise<InventoryItem[]> => {
        try {
            const response = await axios.get<ApiResponse<InventoryItem[]>>(
                `${BASE_URL}/inventory`
            );
            return response.data.data;
        } catch (error) {
            console.error("Error fetching inventory data:", error);
            throw error;
        }
    }
};