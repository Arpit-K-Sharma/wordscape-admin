import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface Staff {
    id: string;
    fullName: string;
    password: string;
    email: string;
    address: string;
    phoneNumber: string;
    created_at: string;
    status: boolean;
    role: string;
    position: string;
    dailyWage?: number; 
    dept_ids?: string[] | null; 
    departmentNames?: string[] | null; 
}

export const staffService = {
    getStaff: async(): Promise<Staff[]> => {
        try {
            const response = await axios.get<Staff[]>(`${API_URL}/staff`);
            return response.data;
        } catch (error) {
            console.error("Error fetching staff data:", error);
            throw error;
        }
    }
};
