"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

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

interface ApiResponse {
  status: string;
  status_code: number;
  data: PurchaseOrder[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function ReorderTable() {
  const [reorders, setReorders] = useState<PurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(`${BASE_URL}/reorders`);
        console.log("Reorders response:", response.data);
        setReorders(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredReorders = reorders.filter((reorder) =>
    reorder.purchaseEntry.some((entry) =>
      entry.vendorId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto py-10">
      <Input
        placeholder="Search by vendor ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReorders.flatMap((reorder) =>
            reorder.purchaseEntry.map((entry, entryIndex) => (
              <TableRow key={`${reorder.orderId}-${entryIndex}`}>
                <TableCell>{entry.vendorId}</TableCell>
                <TableCell>{reorder.orderId}</TableCell>
                <TableCell>
                  <ul>
                    {entry.items.map((item, itemIndex) => (
                      <li key={`${item.itemId}-${itemIndex}`}>
                        {item.itemId} - Qty: {item.quantityFromVendor}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  {entry.isCompleted ? "Completed" : "Pending"}
                </TableCell>
                <TableCell>{entry.grandTotal ?? "N/A"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
