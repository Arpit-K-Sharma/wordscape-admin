import axios from "axios";

const API_URL = "http://127.0.1:8000";

export interface LeaveManagement {
    id: string;
    staff_id: string;
    staff_name: string;
    start_date: string;
    end_date: string;
    reason: string;
    type: string;
    status: string;
}

export const LeaveManagementService = {
    getLeave: async (): Promise<LeaveManagement[]> => {
        try {
            const response = await axios.get<LeaveManagement[]>(`${API_URL}/leave`);
            return response.data;
        } catch (error) {
            // Handle error appropriately, e.g., logging or throwing
            console.error("Error fetching leave data:", error);
            throw error;
        }
    },

    addLeave: async (staff_id: string, leave: Omit<LeaveManagement, "id" | "staff_name">): Promise<void> => {
        try {
            await axios.post(`${API_URL}/leave/${staff_id}`, leave);
        } catch (error) {
            console.error("Error adding leave:", error);
            throw error;
        }
    },
    
    updateLeave: async (leave_id: string, leave: Omit<LeaveManagement, "id" | "status">): Promise<void> => {
        try {
            await axios.put(`${API_URL}/leave/${leave_id}`, leave);
        } catch (error) {
            console.error("Error updating leave:", error);
            throw error;
        }
    },

    approveLeave: async (leave_id: string): Promise<void> => {
        try {
            await axios.post(`${API_URL}/leave/approve/${leave_id}`);
        } catch (error) {
            console.error("Error approving leave:", error);
            throw error;
        }
    },

    declineLeave: async (leave_id: string): Promise<void> => {
        try {
            await axios.post(`${API_URL}/leave/reject/${leave_id}`);
        } catch (error) {
            console.error("Error declining leave:", error);
            throw error;
        }
    }
};
