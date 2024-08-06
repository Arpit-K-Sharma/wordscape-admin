import axios from "../../_axios/axiosInstance";

export interface Department {
  id?: string;
  _id?: string;
  department_name: string;
  description: string;
}

export interface Staff {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  position: string;
  departmentNames: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await axios.get(`${API_URL}/department`);
    return response.data.data;
  },

  addDepartment: async (
    department: Omit<Department, "id">
  ): Promise<Department> => {
    const response = await axios.post(`${API_URL}/department`, department);
    return response.data.data;
  },

  updateDepartment: async (
    id: string,
    department: Omit<Department, "id" | "_id">
  ): Promise<Department> => {
    const response = await axios.put(`${API_URL}/department/${id}`, department);
    return response.data.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/department/${id}`);
  },

  getStaff: async (): Promise<Staff[]> => {
    const response = await axios.get(`${API_URL}/staff`);
    return response.data.data;
  },
};
