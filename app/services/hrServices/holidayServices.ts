import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface Holiday {
  holiday_id: string;
  name: string;
  date: string;
  description: string;
}

export interface HolidayData {
  year: number;
  holidays: Holiday[];
}

export const holidayService = {
  getHolidays: async (): Promise<HolidayData[]> => {
    const response = await axios.get<HolidayData[]>(`${API_URL}/holidays`);
    return response.data.data;
  },

  addHoliday: async (holiday: Omit<Holiday, "holiday_id">): Promise<void> => {
    await axios.post(`${API_URL}/holidays`, holiday);
  },

  updateHoliday: async (
    holidayId: string,
    holiday: Omit<Holiday, "holiday_id">
  ): Promise<void> => {
    await axios.put(`${API_URL}/holidays/${holidayId}`, holiday);
  },

  deleteHoliday: async (holidayId: string): Promise<void> => {
    await axios.delete(`${API_URL}/holidays/${holidayId}`);
  },
};
