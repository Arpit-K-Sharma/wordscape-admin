import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface Department {
  _id: string;
  department_name: string;
  description: string;
}

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await axios.get<Department[]>(`${API_URL}/department`);
    return response.data;
  },

  addDepartment: async (department: Omit<Department, "_id">): Promise<void> => {
    await axios.post(`${API_URL}/department`, department);
  },

  updateDepartment: async (
    id: string,
    department: Omit<Department, "_id">
  ): Promise<void> => {
    await axios.put(`${API_URL}/department/${id}`, department);
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/department/${id}`);
  },
};
