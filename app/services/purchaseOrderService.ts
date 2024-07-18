import axios from 'axios';

// Interfaces
interface PurchaseOrderItem {
    itemId: string;
    quantityFromVendor: number;
    quantityFromStock: number;
    itemCode: string | null;
    rate: number | null;
    amount: number | null;
}

interface PurchaseEntry {
    _id: string;
    vendorId: string;
    isCompleted: boolean;
    items: PurchaseOrderItem[];
    tag: string | null;
    remarks: string | null;
    image: string | null;
    discount: number | null;
    vat: number | null;
    grandTotal: number | null;
    invoiceNo: string | null;
    invoiceDate: string | null;
}

interface PurchaseOrder {
    _id: string;
    orderId: string;
    isCompleted: boolean;
    purchaseEntry: PurchaseEntry[];
}

interface InventoryItem {
    _id: string;
    itemName: string;
    availability: number;
    type: string;
}

interface Vendor {
    _id: string;
    vendorName: string;
    vendorAddress: string;
    vendorVAT: string;
    vendorPhone: string;
}

interface PurchaseEntryItem {
    itemId: string;
    inventoryId: string;
    quantityFromVendor: number;
    quantityFromStock: number;
    itemCode: string | null;
    rate: number | null;
    amount: number | null;
}

interface PurchaseEntryVendor {
    _id: string;
    vendorId: string;
    isCompleted: boolean;
    items: PurchaseEntryItem[];
    tag: string | null;
    remarks: string | null;
    image: string | null;
    discount: number | null;
    vat: number | null;
    grandTotal: number | null;
    invoiceNo: string | null;
    invoiceDate: string | null;
}

interface PurchaseEntryWO {
    _id: string;
    orderId: string;
    isCompleted: boolean;
    purchaseEntry: PurchaseEntryVendor[];
}

interface PurchaseOrderResponse {
    status: string;
    data: PurchaseEntryWO[];
}

interface ApiResponse<T> {
    status: string;
    data: T;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

export const purchaseService = {
    getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
        try {
            const response = await axios.get<ApiResponse<PurchaseOrder[]>>(`${API_BASE_URL}/purchase_orders_with_entries`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching purchase orders:", error);
            throw error;
        }
    },

    // getPurchaseOrdersWithOutEntry: async (): Promise<PurchaseOrderResponse[]> => {
    //     try {
    //         const response = await axios.get<ApiResponse<PurchaseEntryWO[]>>(`${API_BASE_URL}/purchase_orders_without_entries`);
    //         return { status: 'success', data: response.data.data };
    //     } catch (error) {
    //         console.error("Error fetching purchase orders:", error);
    //         throw error;
    //     }
    // },

    getInventoryItems: async (): Promise<InventoryItem[]> => {
        try {
            const response = await axios.get<ApiResponse<InventoryItem[]>>(`${API_BASE_URL}/inventory`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching inventory items:", error);
            throw error;
        }
    },

    getVendors: async (): Promise<Vendor[]> => {
        try {
            const response = await axios.get<ApiResponse<Vendor[]>>(`${API_BASE_URL}/vendors`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching vendors:", error);
            throw error;
        }
    },

    createPurchaseOrder: async (purchaseOrderData: Omit<PurchaseOrder, '_id'>): Promise<PurchaseOrder> => {
        try {
            const response = await axios.post<ApiResponse<PurchaseOrder>>(`${API_BASE_URL}/purchase_orders`, purchaseOrderData);
            return response.data.data;
        } catch (error) {
            console.error("Error creating purchase order:", error);
            throw error;
        }
    },

    updatePurchaseOrder: async (purchaseOrderId: string, purchaseOrderData: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
        try {
            const response = await axios.put<ApiResponse<PurchaseOrder>>(`${API_BASE_URL}/purchase_orders/${purchaseOrderId}`, purchaseOrderData);
            return response.data.data;
        } catch (error) {
            console.error("Error updating purchase order:", error);
            throw error;
        }
    },

    deletePurchaseOrder: async (purchaseOrderId: string): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/purchase_orders/${purchaseOrderId}`);
        } catch (error) {
            console.error("Error deleting purchase order:", error);
            throw error;
        }
    },

};

export default purchaseService;