import axios from './axiosInstance';
import { Customer, CustomerResponse } from '../../Schema/erpSchema/customerSchema';

export const getCustomers = async (page: number): Promise<CustomerResponse> => {
  const response = await axios.get(`/customers?pageNumber=${page}`);
  console.log(response.data)
  return response.data;
};

export const addCustomer = async (customerData: Omit<Customer, 'customerId'>): Promise<Customer> => {
  const response = await axios.post('/customers', customerData);
  return response.data;
};

export const deactivateCustomer = async (customerId: number): Promise<void> => {
  await axios.put(`/customers/deactivate/${customerId}`);
};