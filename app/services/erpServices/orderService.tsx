import axios from "../../_axios/axiosInstance";
import { Order, SelectedOrder } from "../../Schema/erpSchema/OrderSchema";
import { OrderResponse } from "../../erp/order/_components/order";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchOrders = async (
  page: number,
  sortField: string,
  sortDirection: string
): Promise<OrderResponse> => {
  const response = await axios.get(
    `${API_URL}/orders?skip=${page}&sortField=${sortField}&sortDirection=${sortDirection}`
  );
  return {
    response: response.data.orders,
    totalElements: response.data.total_elements,
  };
};

export const fetchOrderDetails = async (
  orderId: string
): Promise<SelectedOrder> => {
  const response = await axios.get(`${API_URL}/jobCard/${orderId}`);
  return response.data;
};

export const fetchTracking = async (
  orderId: string
): Promise<Record<string, boolean>> => {
  const response = await axios.get(`${API_URL}/projectTracking/${orderId}`);
  return response.data;
};

export const updateTracking = async (
  orderId: string,
  stepData: Record<string, boolean>
): Promise<void> => {
  await axios.put(`${API_URL}/projectTracking/${orderId}`, stepData);
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  await axios.put(`${API_URL}/orders/cancel/${orderId}`);
};

export const downloadFile = async (orderId: string): Promise<Blob> => {
  const response = await axios.get(
    `${API_URL}/orders/files/download/${orderId}`,
    {
      responseType: "arraybuffer",
    }
  );
  return new Blob([response.data], { type: "application/pdf" });
};

export const fetchInvoice = async (orderId: string): Promise<Blob> => {
  const response = await axios.get(`${API_URL}/orders/invoice/${orderId}`, {
    responseType: "arraybuffer",
  });
  return new Blob([response.data], { type: "application/pdf" });
};

export const updateDeadline = async (
  orderId: string,
  deadline: string
): Promise<void> => {
  await axios.put(`${API_URL}/jobCard/updateDeadline/${orderId}`, { deadline });
};
