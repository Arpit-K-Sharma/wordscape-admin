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

interface PurchaseEntryItem {
  itemId: string;
  quantityFromVendor: number;
  quantityFromStock: number;
  itemCode: string | null;
  rate: number | null;
  amount: number | null;
}

interface PurchaseEntry {
  _id: string;
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: Array<{
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
  }>;
}

interface InventoryItem {
  _id: string;
  itemName: string;
  availability: number;
  type: string;
}

const PurchaseEntryList: React.FC = () => {
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);
  const [selectedItems, setSelectedItems] = useState<PurchaseEntryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseEntriesResponse, inventoryResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/purchase_orders_without_entries"),
          axios.get("http://127.0.0.1:8000/inventory"),
        ]);

        if (purchaseEntriesResponse.data.status === "success") {
          setPurchaseEntries(purchaseEntriesResponse.data.data);
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

  const handleItemClick = (items: PurchaseEntryItem[]) => {
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
                  <TableCell>
                    <Button onClick={() => handleItemClick(purchase.items)}>
                      View {purchase.items.length} Items
                    </Button>
                  </TableCell>
                  <TableCell>{purchase.grandTotal || "N/A"}</TableCell>
                  <TableCell>{purchase.invoiceNo || "N/A"}</TableCell>
                  <TableCell>{purchase.invoiceDate || "N/A"}</TableCell>
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
                  <TableHead>Item Name</TableHead>
                  <TableHead>Item Type</TableHead>
                  <TableHead>Quantity (Vendor)</TableHead>
                  <TableHead>Quantity (Stock)</TableHead>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((item) => {
                  const itemDetails = getItemDetails(item.itemId);
                  return (
                    <TableRow key={item.itemId}>
                      <TableCell>{itemDetails?.itemName || "N/A"}</TableCell>
                      <TableCell>{itemDetails?.type || "N/A"}</TableCell>
                      <TableCell>{item.quantityFromVendor}</TableCell>
                      <TableCell>{item.quantityFromStock}</TableCell>
                      <TableCell>{item.itemCode || "N/A"}</TableCell>
                      <TableCell>{item.rate || "N/A"}</TableCell>
                      <TableCell>{item.amount || "N/A"}</TableCell>
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

export default PurchaseEntryList;
