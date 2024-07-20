import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

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
    generatePayroll: async (): Promise<void> => {
      try {
        const response = await axios.post(`${API_URL}/payroll`);
        return response.data;
      } catch (error) {
        console.error("Error creating payroll:", error);
        throw error;
      }
    },
  
    getPayroll: async (payrollId: string): Promise<Payroll> => {
      try {
        const response = await axios.get<Payroll>(`${API_URL}/payroll/${payrollId}`);
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
        const payrolls = response.data.map((payroll: any) => ({
          ...payroll,
          id: payroll._id,
        }));
        return payrolls;
      } catch (error) {
        console.error("Error listing payrolls:", error);
        throw error;
      }
    },
  
    getPayrollByMonth: async (month: string): Promise<Payroll | { message: string }> => {
      try {
        const response = await axios.get<Payroll | { message: string }>(`${API_URL}/payroll/month/${month}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching payroll by month:", error);
        throw error;
      }
    }
  };