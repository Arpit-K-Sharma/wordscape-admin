import axios from './axiosInstance';
import { Order, JobCard, CookiesData } from '../../Schema/erpSchema/jobcardSchema';


let baseUrl: string = "http://localhost:8081"


export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get(`${baseUrl}/orders`);
  console.log(response.data.response)
  return response.data.response;
};

export const fetchJobCard = async (orderId: string): Promise<JobCard> => {
  const response = await axios.get(`${baseUrl}/jobCard/${orderId}`);
  console.log("this is the json data",response.data)
  return response.data;
};

export const updateJobCard = async (orderId: string, data: CookiesData): Promise<string> => {
  const response = await axios.put(`${baseUrl}/jobCard/update/${orderId}`, data);
  return response.data;
};

export const createJobCard = async (orderId: string, data: CookiesData): Promise<string> => {
  const response = await axios.post(`${baseUrl}/jobCard/${orderId}`, data);
  return response.data;
};