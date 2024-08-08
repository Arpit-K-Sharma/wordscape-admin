import axios from '../../_axios/axiosInstance';
import { Order, JobCard, CookiesData } from '../../Schema/erpSchema/jobcardSchema';


let baseUrl: string = process.env.NEXT_PUBLIC_API_UR || '';

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get(`${baseUrl}/orders`);
  console.log("this is the order", response.data.orders)
  return response.data.orders;
};

export const fetchJobCard = async (orderId: string): Promise<JobCard> => {
  const response = await axios.get(`${baseUrl}/jobCard/${orderId}`);
  console.log("this is the json data", response.data)
  return response.data;
};


export const createJobCard = async (orderId: string, data: CookiesData): Promise<string> => {
  const response = await axios.post(`${baseUrl}/jobCard/${orderId}`, data);
  return response.data;
};