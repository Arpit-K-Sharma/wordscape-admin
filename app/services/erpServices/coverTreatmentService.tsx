import axios from '../../_axios/axiosInstance';
import { CoverTreatment } from '../../Schema/erpSchema/coverTreatmentSchema';

export const getCoverTreatments = async (): Promise<CoverTreatment[]> => {
  const response = await axios.get<{data: CoverTreatment[]}>('/coverTreatments');
  return response.data.data.sort((a, b) => a.coverTreatmentId - b.coverTreatmentId);
};

export const addCoverTreatment = async (coverTreatmentData: Omit<CoverTreatment, 'coverTreatmentId'>): Promise<CoverTreatment> => {
  const response = await axios.post<CoverTreatment>('/coverTreatments', coverTreatmentData);
  return response.data;
};

export const updateCoverTreatment = async (id: number, updatedData: Partial<CoverTreatment>): Promise<CoverTreatment> => {
  const response = await axios.put<CoverTreatment>(`/coverTreatments/${id}`, updatedData);
  return response.data;
};