import axios from './axiosInstance';
import { PaperSize, SheetSize, Paper, Plate, Binding, Lamination, CoverTreatment, Ink } from '../../Schema/erpSchema/costCalculationSchema';

export const getPaperSizes = async (): Promise<PaperSize[]> => {
  const response = await axios.get<PaperSize[]>('/paperSizes');
  return response.data;
};

export const getSheetSizes = async (): Promise<SheetSize[]> => {
  const response = await axios.get<SheetSize[]>('/sheetSizes');
  return response.data;
};

export const getPapers = async (): Promise<Paper[]> => {
  const response = await axios.get<Paper[]>('/papers');
  return response.data;
};

export const getPlates = async (): Promise<Plate[]> => {
  const response = await axios.get<Plate[]>('/plates');
  return response.data;
};

export const getBindings = async (): Promise<Binding[]> => {
  const response = await axios.get<Binding[]>('/bindings');
  return response.data;
};

export const getLaminations = async (): Promise<Lamination[]> => {
  const response = await axios.get<Lamination[]>('/laminations');
  return response.data;
};

export const getCoverTreatments = async (): Promise<CoverTreatment[]> => {
  const response = await axios.get<CoverTreatment[]>('/coverTreatments');
  return response.data;
};

export const getInks = async (): Promise<Ink[]> => {
  const response = await axios.get<Ink[]>('/inks');
  return response.data;
};