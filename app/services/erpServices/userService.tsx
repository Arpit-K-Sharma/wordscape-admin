import axios from "../../_axios/axiosInstance";
import { User, UserFormData } from "../../Schema/erpSchema/userSchema";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_URL = `${BASE_URL}/staff`;

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get<{ data: User[] }>(API_URL);
  return response.data.data;
};

export const addUser = async (userData: UserFormData): Promise<User> => {
  const response = await axios.post<User>(API_URL, userData);
  return response.data;
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await axios.put<User>(`${API_URL}/${userId}`, userData);
  return response.data;
};
