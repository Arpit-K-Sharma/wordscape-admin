// employeeService.ts

import axios from "axios";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  position: string;
  created_at: string;
  dailyWage: number;
  departmentNames: string[];
  status: boolean;
  address: string;
  role: string;
}

export interface Department {
  id: string;
  department_name: string;
  description: string;
}

export interface NewStaffData {
  fullName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  status: boolean;
  position: string;
  dailyWage: number | string;
  dept_ids: string[];
}

const BASE_URL = "http://127.0.0.1:8000";

export const employeeService = {
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await axios.get(`${BASE_URL}/staff`);
    return response.data.data;
  },

  getAllDepartments: async (): Promise<Department[]> => {
    const response = await axios.get(`${BASE_URL}/department`);
    return response.data.data;
  },

  addEmployee: async (employeeData: NewStaffData): Promise<string> => {
    const formattedData = {
      ...employeeData,
      role: "ROLE_USER",
      status: true,
      dailyWage: Number(employeeData.dailyWage),
    };
    const response = await axios.post(`${BASE_URL}/staff`, formattedData);
    if (
      response.data.status === "success" &&
      response.data.status_code === 200
    ) {
      return response.data.message;
    } else {
      throw new Error(`Failed to add employee: ${response.data.message}`);
    }
  },

  updateEmployee: async (
    id: string,
    employeeData: Partial<Employee>
  ): Promise<Employee> => {
    const response = await axios.put(`${BASE_URL}/staff/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/staff/${id}`);
  },

  changeEmployeeStatus: async (id: string, status: boolean): Promise<void> => {
    const endpoint = status ? "reactivate" : "deactivate";
    await axios.post(`${BASE_URL}/staff/${endpoint}/${id}`, { status });
  },
};
