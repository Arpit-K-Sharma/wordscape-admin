import axios from '../../_axios/axiosInstance';
import { Sheet } from '../../Schema/erpSchema/sheetSchema';

export const getSheets = async (): Promise<Sheet[]> => {
  const response = await axios.get<{data: Sheet[]}>('/sheetSizes');
  return response.data.data;
};

export const addSheet = async (sheetData: Omit<Sheet, 'id'>): Promise<Sheet> => {
  const response = await axios.post<Sheet>('/sheetSizes', sheetData);
  return response.data;
};

export const updateSheet = async (id: string, updatedData: Partial<Sheet>): Promise<Sheet> => {
  const response = await axios.put<Sheet>(`/sheetSizes/${id}`, updatedData);
  return response.data;
};