import axios from './axiosInstance';
import { PaperThickness } from '../../Schema/erpSchema/paperThickness';

export const getPaperThicknesses = async (): Promise<PaperThickness[]> => {
  const response = await axios.get<PaperThickness[]>('/paperThickness');
  return response.data.sort((a, b) => a.thicknessId - b.thicknessId);
};

export const addPaperThickness = async (thickness: number): Promise<PaperThickness> => {
  const response = await axios.post<PaperThickness>('/paperThickness', { thickness });
  return response.data;
};

export const updatePaperThickness = async (id: number, updatedData: Partial<PaperThickness>): Promise<PaperThickness> => {
  const response = await axios.put<PaperThickness>(`/paperThickness/${id}`, updatedData);
  return response.data;
};