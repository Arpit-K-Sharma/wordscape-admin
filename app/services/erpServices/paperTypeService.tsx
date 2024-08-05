import axios from '../../_axios/axiosInstance';
import { Paper } from '../../Schema/erpSchema/paperTypeSchema';

export const getPapers = async (): Promise<Paper[]> => {
    const response = await axios.get<{data: Paper[]}>('/papers');
    return response.data.data.sort((a, b) => a.paperId - b.paperId);
};

export const addPaper = async (paper: Omit<Paper, 'paperId'>): Promise<Paper> => {
    const response = await axios.post<Paper>('/papers', paper);
    return response.data;
};

export const updatePaper = async (id: number, paper: Omit<Paper, 'paperId'>): Promise<Paper> => {
    const response = await axios.put<Paper>(`/papers/${id}`, paper);
    return response.data;
};