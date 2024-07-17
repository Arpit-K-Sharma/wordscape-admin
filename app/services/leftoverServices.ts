import axios from 'axios';
import { Leftover } from '../components/Leftover/Leftover';

import { InventoryResponse } from '../components/Leftover/Leftover';

const API_BASE_URL = 'http://localhost:8000';

export const fetchLeftovers = async (): Promise<Leftover[]> => {
  const response = await axios.get(`${API_BASE_URL}/leftovers`);
  return response.data;
};

export const fetchInventory = async (): Promise<InventoryResponse> => {
  const response = await axios.get(`${API_BASE_URL}/inventory`);
  return response.data;
};