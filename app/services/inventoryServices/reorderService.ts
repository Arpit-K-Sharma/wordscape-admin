import axios from "../../_axios/axiosInstance";

interface Item {
  inventoryId: string;
  itemId: string;
  quantityFromVendor: number;
  quantityFromStock: number;
  itemCode: string | null;
  rate: number | null;
  amount: number | null;
}

interface PurchaseEntry {
  _id: string | null;
  vendorId: string;
  isCompleted: boolean;
  items: Item[];
  tag: string;
  remarks: string;
  image: string | null;
  discount: number | null;
  vat: number | null;
  grandTotal: number | null;
  invoiceNo: string | null;
  invoiceDate: string | null;
}

interface PurchaseOrder {
  _id: string | null;
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: PurchaseEntry[];
}

interface ApiResponse<T> {
  status: string;
  status_code: number;
  data: T;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const reorderService = {
  getReorders: async (): Promise<PurchaseOrder[]> => {
    try {
      const response = await axios.get<ApiResponse<PurchaseOrder[]>>(
        `${API_BASE_URL}/reorders`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching reorders:", error);
      throw error;
    }
  },

  createReorder: async (
    reorderData: Omit<PurchaseOrder, "_id">
  ): Promise<PurchaseOrder> => {
    try {
      const response = await axios.post<{ data: PurchaseOrder }>(
        `${API_BASE_URL}/reorders`,
        reorderData
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating reorder:", error);
      throw error;
    }
  },
};

export default reorderService;
