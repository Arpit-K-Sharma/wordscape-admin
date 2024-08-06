import axios from "@/app/_axios/axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface Staff {
  id?: string;
  _id?: string;
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
  getStaff: async (): Promise<Staff[]> => {
    try {
      const response = await axios.get<Staff[]>(`${API_URL}/staff`);
      return response.data;
    } catch (error) {
      console.error("Error fetching staff data:", error);
      throw error;
    }
  },
  getStaffById: async (staffId: string): Promise<Staff> => {
    console.log("hello");
    const response = await axios.get(`${API_URL}/staff/${staffId}`);
    console.log(response.data.data);
    return response.data.data;
  },
};
