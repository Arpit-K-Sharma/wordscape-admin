import axios from '../../_axios/axiosInstance';
import { PaperSize, SheetSize, Paper, Plate, Binding, Lamination, CoverTreatment, Ink } from '../../Schema/erpSchema/costCalculationSchema';

export const getPaperSizes = async (): Promise<PaperSize[]> => {
  const response = await axios.get<{data: PaperSize[]}>('/paperSizes');
  console.log(response.data.data, "this is the dsts")
  return response.data.data;
};

export const getSheetSizes = async (): Promise<SheetSize[]> => {
  const response = await axios.get<{data: SheetSize[]}>('/sheetSizes');
  return response.data.data;
};

export const getPapers = async (): Promise<Paper[]> => {
  const response = await axios.get<{data: Paper[]}>('/papers');
  return response.data.data;
};

export const getPlates = async (): Promise<Plate[]> => {
  const response = await axios.get<{data: Plate[]}>('/plates');
  return response.data.data;
};

export const getBindings = async (): Promise<Binding[]> => {
  const response = await axios.get<{data: Binding[]}>('/bindings');
  return response.data.data;
};

export const getLaminations = async (): Promise<Lamination[]> => {
  const response = await axios.get<{data: Lamination[]}>('/laminations');
  return response.data.data;
};

export const getCoverTreatments = async (): Promise<CoverTreatment[]> => {
  const response = await axios.get<{data: CoverTreatment[]}>('/coverTreatments');
  return response.data.data;
};

export const getInks = async (): Promise<Ink[]> => {
  const response = await axios.get<{data: Ink[]}>('/inks');
  return response.data.data;
};