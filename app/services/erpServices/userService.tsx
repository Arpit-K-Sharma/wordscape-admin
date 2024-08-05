import axios from '../../_axios/axiosInstance';
import { User, UserFormData } from '../../Schema/erpSchema/userSchema';

const API_URL = '/users'; 

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(API_URL);
  return response.data;
};

export const addUser = async (userData: UserFormData): Promise<User> => {
  const response = await axios.post<User>(API_URL, userData);
  return response.data;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const response = await axios.put<User>(`${API_URL}/${userId}`, userData);
  return response.data;
};