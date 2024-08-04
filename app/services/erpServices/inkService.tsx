import axios from './axiosInstance';
import { Ink } from '../../Schema/erpSchema/inkSchema';

export const getInks = async (): Promise<Ink[]> => {
  const response = await axios.get<Ink[]>('/inks');
  return response.data;
};

export const addInk = async (inkData: Omit<Ink, 'inkId'>): Promise<Ink> => {
  const response = await axios.post<Ink>('/inks', inkData);
  return response.data;
};

export const updateInk = async (id: number, updatedData: Partial<Ink>): Promise<Ink> => {
  const response = await axios.put<Ink>(`/inks/${id}`, updatedData);
  return response.data;
};