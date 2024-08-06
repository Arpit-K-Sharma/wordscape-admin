// services/orderService.ts
import axios from "../../_axios/axiosInstance";
import { Order, TrackingData } from "../../Schema/erpSchema/dashboardSchema";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchOrders = async (
  page: number = 0,
  sortField: string = "date",
  sortDirection: string = "asc"
): Promise<Order[]> => {
  const response = await axios.get(
    `${BASE_URL}/orders?pageNumber=${page}&sortField=${sortField}&sortDirection=${sortDirection}`
  );
  return response.data.orders;
};

export const fetchOrderDetails = async (id: string): Promise<Order> => {
  const response = await axios.get(`/orders/${id}`);
  return response.data;
};

export const fetchJobCard = async (order: string): Promise<any> => {
  const response = await axios.get(`/jobCard/${order}`);
  return response.data;
};

export const fetchProjectTracking = async (
  id: string
): Promise<TrackingData> => {
  const response = await axios.get(`/projectTracking/${id}`);
  return response.data;
};

export const updateProjectTracking = async (
  id: string,
  stepData: TrackingData
): Promise<void> => {
  await axios.post(`/projectTracking/${id}`, stepData);
};

export const cancelOrder = async (id: string): Promise<void> => {
  await axios.put(`/orders/cancel/${id}`);
};

export const fetchTrackingData = async (
  orderId: string
): Promise<TrackingData> => {
  const response = await axios.get(`/projectTracking/${orderId}`);
  return response.data;
};
