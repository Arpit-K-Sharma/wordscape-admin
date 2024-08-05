import axios from '../../_axios/axiosInstance';
import { Binding } from '../../Schema/erpSchema/bindingSchema';

export const getBindings = async (): Promise<Binding[]> => {
  const response = await axios.get<{data: Binding[]}>('/bindings');
  return response.data.data.sort((a, b) => a.id - b.id);
};

export const addBinding = async (bindingData: Omit<Binding, 'id'>): Promise<Binding> => {
  const response = await axios.post<Binding>('/bindings', bindingData);
  return response.data;
};

export const updateBinding = async (id: number, updatedData: Partial<Binding>): Promise<Binding> => {
  const response = await axios.put<Binding>(`/bindings/${id}`, updatedData);
  return response.data;
};