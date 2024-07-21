// attendanceService.ts

import axios from 'axios';
import { format } from 'date-fns';
import { Staff, AttendanceSubmission, AttendanceData } from '@/app/components/Attendance/AttendanceForm';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const attendanceService = {
  async getStaffList(): Promise<Staff[]> {
    try {
      const response = await axios.get<{ data: Staff[] }>(`${API_BASE_URL}/staff`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching staff data:', error);
      throw error;
    }
  },

  async submitAttendance(data: AttendanceSubmission): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/attendance`, data);
      alert("Attendance submitted successfully");
      return response.data.data;
    } catch (error) {
      console.error('Error submitting attendance:', error);
      throw error;
    }
  },

  async getAttendanceByDate(date: string): Promise<AttendanceData> {
    try {
      const response = await axios.get<{ data: AttendanceData }>(`${API_BASE_URL}/attendance/${date}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      throw error;
    }
  }
};