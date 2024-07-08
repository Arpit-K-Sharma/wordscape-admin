"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import InventorySidebar from "../Sidebar/InventorySidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PurchaseOrderItem {
  itemId: string;
  quantityFromVendor: number;
  quantityFromStock: number;
  itemCode: string;
  rate: number;
  amount: number;
}

interface PurchaseOrder {
  _id: string;
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: Array<{
    _id: string;
    vendorId: string;
    isCompleted: boolean;
    items: PurchaseOrderItem[];
    tag: string | null;
    remarks: string | null;
    image: string | null;
    discount: number | null;
    vat: number | null;
    grandTotal: number;
    invoiceNo: string;
    invoiceDate: string;
  }>;
}

const PurchaseWithEntry: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/purchase_orders_with_entries"
        );
        if (response.data.status === "success") {
          setPurchaseOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    };

    fetchPurchaseOrders();
  }, []);

  return (
    <div className="flex">
      <InventorySidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Purchase Orders</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Vendor ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>VAT</TableHead>
              <TableHead>Grand Total</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead>Invoice Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((order) =>
              order.purchaseEntry.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.isCompleted ? "Yes" : "No"}</TableCell>
                  <TableCell>{entry.vendorId}</TableCell>
                  <TableCell>{entry.items.length}</TableCell>
                  <TableCell>{entry.discount || "N/A"}</TableCell>
                  <TableCell>{entry.vat || "N/A"}</TableCell>
                  <TableCell>{entry.grandTotal}</TableCell>
                  <TableCell>{entry.invoiceNo}</TableCell>
                  <TableCell>{entry.invoiceDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PurchaseWithEntry;
