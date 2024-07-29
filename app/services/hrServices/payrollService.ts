import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface Payroll {
  id: string;
  staff_id: string;
  staff_name: string;
  month: string;
  working_days: number;
  paid_leaves: number;
  holidays: number;
  weekends: number;
  daily_wage: number;
  sub_total: number;
  tax: number;
  net_salary: number;
}

export const PayrollService = {
  getPayroll: async (payrollId: string): Promise<Payroll> => {
    try {
      const response = await axios.get<Payroll>(
        `${API_URL}/payroll/${payrollId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payroll:", error);
      throw error;
    }
  },

  deletePayroll: async (payrollId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/payroll/${payrollId}`);
    } catch (error) {
      console.error("Error deleting payroll:", error);
      throw error;
    }
  },

  listPayrolls: async (): Promise<Payroll[]> => {
    try {
      const response = await axios.get<Payroll[]>(`${API_URL}/payroll`);
      // Map _id to id
      const payrolls = response.data.data.map((payroll: any) => ({
        ...payroll,
        id: payroll._id,
      }));
      return payrolls;
    } catch (error) {
      console.error("Error listing payrolls:", error);
      throw error;
    }
  },

  getPayrollByMonth: async (
    month: string
  ): Promise<Payroll | { message: string }> => {
    try {
      const response = await axios.get<Payroll | { message: string }>(
        `${API_URL}/payroll/month/${month}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payroll by month:", error);
      throw error;
    }
  },

  getPayrollForStaff: async (staffId: string): Promise<Payroll[]> => {
    try {
      const response = await axios.get<Payroll[]>(
        `${API_URL}/payroll/staff/${staffId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching payroll for staff:", error);
      throw error;
    }
  },
};
