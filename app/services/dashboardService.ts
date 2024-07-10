import axios from "axios";

const BASE_URL = "http://localhost:8000";

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
    coverTreatment: string;
    innerPaper: string;
    innerPaperThickness: string;
    outerPaper: string;
    outerPaperThickness: string;
    innerLamination: string;
    outerLamination: string;
    inkType: string;
    deliveryOption: string;
    status: string;

}

export interface User {
    fullName: string;
    coverTreatmentType: string;
}

export interface Cover {
    coverTreatmentType: string;
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
    }
};