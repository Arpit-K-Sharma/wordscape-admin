import axios from '../../_axios/axiosInstance';
import { Binding } from '../../Schema/erpSchema/bindingSchema';

export const getBindings = async (): Promise<Binding[]> => {
  const response = await axios.get<Binding[]>('/bindings');
  return response.data.sort((a, b) => a.bindingId - b.bindingId);
};

export const addBinding = async (bindingData: Omit<Binding, 'bindingId'>): Promise<Binding> => {
  const response = await axios.post<Binding>('/bindings', bindingData);
  return response.data;
};

export const updateBinding = async (id: number, updatedData: Partial<Binding>): Promise<Binding> => {
  const response = await axios.put<Binding>(`/bindings/${id}`, updatedData);
  return response.data;
};