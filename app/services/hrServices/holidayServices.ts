import axios from "../../_axios/axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
    const response = await axios.get<{ data: HolidayData[] }>(
      `${API_URL}/holidays`
    ); // Updated type
    return response.data.data; // Accessing response.data.data as intended
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
