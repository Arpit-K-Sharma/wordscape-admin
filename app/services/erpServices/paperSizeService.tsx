import axios from './axiosInstance';
import { PaperSize } from '../../Schema/erpSchema/paperSizeSchema';

export const getPaperSizes = async (): Promise<PaperSize[]> => {
  const response = await axios.get<PaperSize[]>('/paperSizes');
  return response.data.sort((a, b) => a.paperSizeId.localeCompare(b.paperSizeId));
};

export const addPaperSize = async (paperSize: Omit<PaperSize, 'paperSizeId'>): Promise<PaperSize> => {
  const response = await axios.post<PaperSize>('/paperSizes', paperSize);
  return response.data;
};

export const updatePaperSize = async (id: string, paperSize: Omit<PaperSize, 'paperSizeId'>): Promise<PaperSize> => {
  const response = await axios.put<PaperSize>(`/paperSizes/${id}`, paperSize);
  return response.data;
};