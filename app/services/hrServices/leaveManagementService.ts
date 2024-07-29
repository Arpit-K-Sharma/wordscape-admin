import axios from "axios";
import { error } from "console";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface LeaveManagement {
  id?: string;

  _id: string;
  staff_id: string;
  staff_name: string;
  start_date: Date;
  end_date: Date;
  reason: string;
  type: string;
  status: string;
}

interface LeaveResponse {
  data: LeaveManagement[];
}

export const LeaveManagementService = {
  getLeave: async (): Promise<LeaveResponse> => {
    try {
      const response = await axios.get<LeaveResponse>(`${API_URL}/leave`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leave data:", error);
      throw error;
    }
  },

  addLeave: async (
    staff_id: string,
    leave: Omit<LeaveManagement, "id" | "staff_name">
  ): Promise<void> => {
    try {
      await axios.post(`${API_URL}/leave/${staff_id}`, leave);
    } catch (error) {
      console.error("Error adding leave:", error);
      throw error;
    }
  },

  updateLeave: async (
    leave_id: string,
    leave: Omit<LeaveManagement, "id" | "status">
  ): Promise<void> => {
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
  },

  getLeaveByStaff: async (staff_id: string): Promise<LeaveManagement[]> => {
    try {
      const response = await axios.get<LeaveResponse>(
        `${API_URL}/leave/staff/${staff_id}`
      );
      return response.data.data;
    } catch (error) {
      console.log("Error fetching data", error);
      return [];
    }
  },
};
