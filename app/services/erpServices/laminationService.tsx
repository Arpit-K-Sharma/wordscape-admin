import axios from '../../_axios/axiosInstance';
import { Lamination } from '../../Schema/erpSchema/laminationSchema';

export const getLaminations = async (): Promise<Lamination[]> => {
  const response = await axios.get<{data: Lamination[]}>('/laminations');
  return response.data.data.sort((a, b) => a.id - b.id);
};

export const addLamination = async (laminationData: Omit<Lamination, 'id'>): Promise<Lamination> => {
  const response = await axios.post<Lamination>('/laminations', laminationData);
  return response.data;
};

export const updateLamination = async (id: string, updatedData: Partial<Lamination>): Promise<Lamination> => {
  const response = await axios.put<Lamination>(`/laminations/${id}`, updatedData);
  return response.data;
};