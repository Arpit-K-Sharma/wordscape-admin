import axios from "../../_axios/axiosInstance";
import { format } from "date-fns";
import { Staff } from "./staffService";
import {
  AttendanceData,
  AttendanceSubmission,
} from "@/app/hr/attendance/_components/attendance";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface AttendanceEntry {
  date: string;
  staffs: [
    {
      staff_id: string;
      staff_name: string;
      check_in: string;
      check_out: string;
      status: string;
      remarks: string;
    }
  ];
}

export const attendanceService = {
  async getStaffList(): Promise<Staff[]> {
    try {
      const response = await axios.get<{ data: Staff[] }>(
        `${API_BASE_URL}/staff`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching staff data:", error);
      throw error;
    }
  },

  async submitAttendance(data: AttendanceSubmission): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/attendance`, data);
      alert("Attendance submitted successfully");
      return response.data.data;
    } catch (error) {
      console.error("Error submitting attendance:", error);
      throw error;
    }
  },

  async getAttendanceByDate(date: string): Promise<AttendanceData> {
    try {
      const response = await axios.get<{ data: AttendanceData }>(
        `${API_BASE_URL}/attendance/${date}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      throw error;
    }
  },

  getAttendanceByMonth: async (
    staffId: string,
    year: string,
    month: string
  ): Promise<AttendanceEntry[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/attendance/${staffId}/${year}/${month}`
    );
    return response.data.data;
  },
};
