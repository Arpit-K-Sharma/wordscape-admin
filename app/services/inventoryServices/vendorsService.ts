import axios from "../../_axios/axiosInstance";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

export const vendorService = {
  getVendors: async (): Promise<Vendor[]> => {
    try {
      const response = await axios.get<{ status: string; data: Vendor[] }>(
        `${BASE_URL}/vendors`
      );
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      } else {
        console.error("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
  },

  createVendor: async (data: Omit<Vendor, "_id">): Promise<Vendor> => {
    try {
      console.log(data);
      const response = await axios.post<Vendor>(`${BASE_URL}/vendor`, data);
      return response.data;
    } catch (error) {
      console.error("Error occurred while creating a vendor:", error);
      throw error;
    }
  },

  updateVendor: async (id: string, data: Partial<Vendor>): Promise<Vendor> => {
    try {
      const response = await axios.put<{ status: string; data: Vendor }>(
        `${BASE_URL}/vendor/${id}`,
        data
      );
      if (response.data.status === "success") {
        return response.data.data;
      } else {
        throw new Error("Failed to update vendor");
      }
    } catch (error) {
      console.error("Error occurred while updating the vendor:", error);
      throw error;
    }
  },

  deleteVendor: async (id: string): Promise<void> => {
    try {
      const response = await axios.delete<{ status: string }>(
        `${BASE_URL}/vendor/${id}`
      );
      if (response.data.status !== "success") {
        throw new Error("Failed to delete vendor");
      }
    } catch (error) {
      console.error("Error occurred while deleting the vendor:", error);
      throw error;
    }
  },
};
