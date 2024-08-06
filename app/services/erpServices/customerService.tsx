import axios from "../../_axios/axiosInstance";
import { Customer } from "../../Schema/erpSchema/customerSchema";

const url = process.env.NEXT_PUBLIC_BASE_URL;

export const getCustomers = async (
  page: number
): Promise<{ customers: Customer[]; total_elements: number }> => {
  const response = await axios.get(
    `${url}/customers?skip=${page}&limit=10&sort_field=id&sort_direction=asc`
  );
  return response.data;
};

export const deactivateCustomer = async (customerId: string): Promise<void> => {
  await axios.put(`/customers/deactivate/${customerId}`);
};
