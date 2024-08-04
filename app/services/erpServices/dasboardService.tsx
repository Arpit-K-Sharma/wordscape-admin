// services/orderService.ts

import axios from './axiosInstance';
import { Order, TrackingData } from '../../Schema/erpSchema/dashboardSchema'

export const fetchOrders = async (pageSize: number = 5, sortField: string = 'date'): Promise<Order[]> => {
  const response = await axios.get(`http://localhost:8081/orders?pageSize=${pageSize}&sortField=${sortField}`);
  return response.data.response;
};

export const fetchOrderDetails = async (id: string): Promise<Order> => {
  const response = await axios.get(`/orders/${id}`);
  return response.data;
};

export const fetchJobCard = async (order: string): Promise<any> => {
  const response = await axios.get(`/jobCard/${order}`);
  return response.data;
};

export const fetchProjectTracking = async (id: string): Promise<TrackingData> => {
  const response = await axios.get(`/projectTracking/${id}`);
  return response.data;
};

export const updateProjectTracking = async (id: string, stepData: TrackingData): Promise<void> => {
  await axios.post(`/projectTracking/${id}`, stepData);
};

export const cancelOrder = async (id: string): Promise<void> => {
  await axios.put(`/orders/cancel/${id}`);
};

export const fetchTrackingData = async (orderId: string): Promise<TrackingData> => {
    const response = await axios.get(`/projectTracking/${orderId}`);
    return response.data;
  };