import axios from '../../_axios/axiosInstance';
import { Plate } from '../../Schema/erpSchema/platesSchema';

export const getPlates = async (): Promise<Plate[]> => {
  const response = await axios.get<{data: Plate[]}>('/plates');
  return response.data.data;
};

export const addPlate = async (plateData: Omit<Plate, 'id'>): Promise<Plate> => {
  const response = await axios.post<Plate>('/plates', plateData);
  return response.data;
};

export const updatePlate = async (id: number, updatedData: Partial<Plate>): Promise<Plate> => {
  const response = await axios.put<Plate>(`/plates/${id}`, updatedData);
  return response.data;
};