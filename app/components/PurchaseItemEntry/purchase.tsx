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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface InventoryItem {
  _id: string;
  itemName: string;
  availability: number;
  type: string;
}

const PurchaseWithEntry: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedItems, setSelectedItems] = useState<PurchaseOrderItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseOrdersResponse, inventoryResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/purchase_orders_with_entries"),
          axios.get("http://127.0.0.1:8000/inventory"),
        ]);

        if (purchaseOrdersResponse.data.status === "success") {
          setPurchaseOrders(purchaseOrdersResponse.data.data);
        }

        if (inventoryResponse.data.status === "success") {
          setInventoryItems(inventoryResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (items: PurchaseOrderItem[]) => {
    setSelectedItems(items);
    setIsDialogOpen(true);
  };

  const getItemDetails = (itemId: string) => {
    return inventoryItems.find((item) => item._id === itemId);
  };

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
                  <TableCell>
                    <Button onClick={() => handleItemClick(entry.items)}>
                      View {entry.items.length} Items
                    </Button>
                  </TableCell>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Item Details</DialogTitle>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Item Type</TableHead>
                  <TableHead>Quantity (Vendor)</TableHead>
                  <TableHead>Quantity (Stock)</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((item) => {
                  const itemDetails = getItemDetails(item.itemId);
                  return (
                    <TableRow key={item.itemId}>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{itemDetails?.itemName || "N/A"}</TableCell>
                      <TableCell>{itemDetails?.type || "N/A"}</TableCell>
                      <TableCell>{item.quantityFromVendor}</TableCell>
                      <TableCell>{item.quantityFromStock}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PurchaseWithEntry;
