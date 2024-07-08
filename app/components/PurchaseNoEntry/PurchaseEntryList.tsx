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

interface PurchaseEntry {
  _id: string;
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: Array<{
    _id: string;
    vendorId: string;
    isCompleted: boolean;
    items: Array<{
      itemId: string;
      quantityFromVendor: number;
      quantityFromStock: number;
      itemCode: string | null;
      rate: number | null;
      amount: number | null;
    }>;
    tag: string | null;
    remarks: string | null;
    image: string | null;
    discount: number | null;
    vat: number | null;
    grandTotal: number | null;
    invoiceNo: string | null;
    invoiceDate: string | null;
  }>;
}

const PurchaseEntryList: React.FC = () => {
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);

  useEffect(() => {
    const fetchPurchaseEntries = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/purchase_orders_without_entries"
        );
        if (response.data.status === "success") {
          setPurchaseEntries(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching purchase entries:", error);
      }
    };

    fetchPurchaseEntries();
  }, []);

  return (
    <div className="flex">
      <InventorySidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">
          Purchase Entries{" "}
          <span className="font-normal">(Items yet to be received)</span>
        </h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Vendor ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Grand Total</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead>Invoice Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseEntries.map((entry) =>
              entry.purchaseEntry.map((purchase) => (
                <TableRow key={purchase._id}>
                  <TableCell>{entry.orderId}</TableCell>
                  <TableCell>{entry.isCompleted ? "Yes" : "No"}</TableCell>
                  <TableCell>{purchase.vendorId}</TableCell>
                  <TableCell>{purchase.items.length}</TableCell>
                  <TableCell>{purchase.grandTotal || "N/A"}</TableCell>
                  <TableCell>{purchase.invoiceNo || "N/A"}</TableCell>
                  <TableCell>{purchase.invoiceDate || "N/A"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PurchaseEntryList;
