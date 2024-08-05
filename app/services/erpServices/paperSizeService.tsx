import axios from '../../_axios/axiosInstance';
import { PaperSize } from '../../Schema/erpSchema/paperSizeSchema';

export const getPaperSizes = async (): Promise<PaperSize[]> => {
  const response = await axios.get<{data: PaperSize[]}>('/paperSizes');
  return response.data.data.sort((a, b) => a.id.localeCompare(b.id));
};

export const addPaperSize = async (paperSize: Omit<PaperSize, 'id'>): Promise<PaperSize> => {
  const response = await axios.post<PaperSize>('/paperSizes', paperSize);
  return response.data;
};

export const updatePaperSize = async (id: string, paperSize: Omit<PaperSize, 'id'>): Promise<PaperSize> => {
  const response = await axios.put<PaperSize>(`/paperSizes/${id}`, paperSize);
  return response.data;
};