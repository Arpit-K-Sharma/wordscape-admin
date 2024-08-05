import axios from '../../_axios/axiosInstance';
import { Lamination } from '../../Schema/erpSchema/laminationSchema';

export const getLaminations = async (): Promise<Lamination[]> => {
  const response = await axios.get<Lamination[]>('/laminations');
  return response.data.sort((a, b) => a.laminationId - b.laminationId);
};

export const addLamination = async (laminationData: Omit<Lamination, 'laminationId'>): Promise<Lamination> => {
  const response = await axios.post<Lamination>('/laminations', laminationData);
  return response.data;
};

export const updateLamination = async (id: number, updatedData: Partial<Lamination>): Promise<Lamination> => {
  const response = await axios.put<Lamination>(`/laminations/${id}`, updatedData);
  return response.data;
};