// departmentService.ts

import axios from "axios";

export interface Department {
  _id: string;
  department_name: string;
  description: string;
}

export interface Staff {
  _id: string;
  fullName: string;
  email: string;
  position: string;
  departmentNames: string[];
}

const API_URL = "http://127.0.0.1:8000"; // Replace with your actual API base URL

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await axios.get(`${API_URL}/department`);
    return response.data;
  },

  addDepartment: async (
    department: Omit<Department, "_id">
  ): Promise<Department> => {
    const response = await axios.post(`${API_URL}/department`, department);
    return response.data;
  },

  updateDepartment: async (
    id: string,
    department: Omit<Department, "_id">
  ): Promise<Department> => {
    const response = await axios.put(`${API_URL}/department/${id}`, department);
    return response.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/department/${id}`);
  },

  getStaff: async (): Promise<Staff[]> => {
    const response = await axios.get(`${API_URL}/staff`);
    return response.data;
  },
};
