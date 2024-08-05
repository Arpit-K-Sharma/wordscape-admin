import axios from '../../_axios/axiosInstance';
import { Sheet } from '../../Schema/erpSchema/sheetSchema';

export const getSheets = async (): Promise<Sheet[]> => {
  const response = await axios.get<Sheet[]>('/sheetSizes');
  return response.data;
};

export const addSheet = async (sheetData: Omit<Sheet, 'sheetSizeId'>): Promise<Sheet> => {
  const response = await axios.post<Sheet>('/sheetSizes', sheetData);
  return response.data;
};

export const updateSheet = async (id: number, updatedData: Partial<Sheet>): Promise<Sheet> => {
  const response = await axios.put<Sheet>(`/sheetSizes/${id}`, updatedData);
  return response.data;
};