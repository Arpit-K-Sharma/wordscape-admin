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

const PurchaseWithEntry: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedItems, setSelectedItems] = useState<PurchaseOrderItem[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const urls = [
      {
        url: "http://127.0.0.1:8000/purchase_orders_with_entries",
        setter: setPurchaseOrders,
      },
      { url: "http://127.0.0.1:8000/inventory", setter: setInventoryItems },
      { url: "http://127.0.0.1:8000/vendors", setter: setVendors },
    ];

    const fetchData = async () => {
      try {
        const responses = await Promise.all(urls.map((u) => axios.get(u.url)));
        responses.forEach((response, index) => {
          if (response.data.status === "success") {
            urls[index].setter(response.data.data);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (items: PurchaseOrderItem[]) => {
    setSelectedItems(items);
    setIsItemDialogOpen(true);
  };

  const handleVendorClick = (vendorId: string) => {
    const vendor = vendors.find((v) => v._id === vendorId);
    if (vendor) {
      setSelectedVendor(vendor);
      setIsVendorDialogOpen(true);
    }
  };

  const getItemDetails = (itemId: string) => {
    return inventoryItems.find((item) => item._id === itemId);
  };

  return (
    <div>
      <div className="flex">
        <InventorySidebar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">Purchase Orders</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>VAT</TableHead>
                <TableHead>Grand Total</TableHead>
                <TableHead>Invoice No</TableHead>
                <TableHead>Invoice Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders &&
                Array.isArray(purchaseOrders) &&
                purchaseOrders.map(
                  (order) =>
                    order.purchaseEntry &&
                    Array.isArray(order.purchaseEntry) &&
                    order.purchaseEntry.map((entry) => (
                      <TableRow key={entry._id}>
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>
                          {order.isCompleted ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleVendorClick(entry.vendorId)}
                          >
                            View Vendor
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleItemClick(entry.items)}>
                            View {entry.items.length} Items
                          </Button>
                        </TableCell>
                        <TableCell>{entry.discount || "N/A"}</TableCell>
                        <TableCell>{entry.vat || "N/A"}</TableCell>
                        <TableCell>{entry.grandTotal || "N/A"}</TableCell>
                        <TableCell>{entry.invoiceNo || "N/A"}</TableCell>
                        <TableCell>{entry.invoiceDate || "N/A"}</TableCell>
                      </TableRow>
                    ))
                )}
            </TableBody>
          </Table>

          <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
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
                  {selectedItems.map((item, index) => {
                    const itemDetails = getItemDetails(item.itemId);
                    return (
                      <TableRow key={index}>
                        <TableCell>{item.itemCode || "N/A"}</TableCell>
                        <TableCell>{itemDetails?.itemName || "N/A"}</TableCell>
                        <TableCell>{itemDetails?.type || "N/A"}</TableCell>
                        <TableCell>{item.quantityFromVendor}</TableCell>
                        <TableCell>{item.quantityFromStock}</TableCell>
                        <TableCell>{item.rate || "N/A"}</TableCell>
                        <TableCell>{item.amount || "N/A"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isVendorDialogOpen}
            onOpenChange={setIsVendorDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vendor Details</DialogTitle>
              </DialogHeader>
              {selectedVendor && (
                <div>
                  <p>
                    <strong>Name:</strong> {selectedVendor.vendorName}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedVendor.vendorAddress}
                  </p>
                  <p>
                    <strong>VAT:</strong> {selectedVendor.vendorVAT}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedVendor.vendorPhone}
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PurchaseWithEntry;
