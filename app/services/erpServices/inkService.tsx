import axios from '../../_axios/axiosInstance';
import { Ink } from '../../Schema/erpSchema/inkSchema';

export const getInks = async (): Promise<Ink[]> => {
  const response = await axios.get<{data: Ink[]}>('/inks');
  return response.data.data;
};

export const addInk = async (inkData: Omit<Ink, 'id'>): Promise<Ink> => {
  const response = await axios.post<Ink>('/inks', inkData);
  return response.data;
};

export const updateInk = async (id: number, updatedData: Partial<Ink>): Promise<Ink> => {
  const response = await axios.put<Ink>(`/inks/${id}`, updatedData);
  return response.data;
};