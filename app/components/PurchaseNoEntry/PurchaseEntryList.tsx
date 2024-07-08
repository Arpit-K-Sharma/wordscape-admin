"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import InventorySidebar from "../Sidebar/InventorySidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Upload } from "lucide-react";

interface PurchaseEntryItem {
  itemId: string;
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

interface PurchaseEntry {
  _id: string;
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: PurchaseEntryVendor[];
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

const PurchaseEntryList: React.FC = () => {
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<PurchaseEntry | null>(
    null
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseEntriesResponse, inventoryResponse, vendorsResponse] =
          await Promise.all([
            axios.get("http://127.0.0.1:8000/purchase_orders_without_entries"),
            axios.get("http://127.0.0.1:8000/inventory"),
            axios.get("http://127.0.0.1:8000/vendors"),
          ]);

        if (purchaseEntriesResponse.data.status === "success") {
          setPurchaseEntries(purchaseEntriesResponse.data.data);
        }

        if (inventoryResponse.data.status === "success") {
          setInventoryItems(inventoryResponse.data.data);
        }

        if (vendorsResponse.data.status === "success") {
          setVendors(vendorsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDetailsClick = (entry: PurchaseEntry) => {
    setSelectedEntry(entry);
    setIsDetailsDialogOpen(true);
  };

  const getItemDetails = (itemId: string) => {
    return inventoryItems.find((item) => item._id === itemId);
  };

  const getVendorDetails = (vendorId: string) => {
    return vendors.find((vendor) => vendor._id === vendorId);
  };

  const handleFileUpload = (
    entryId: string,
    vendorId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Handle file upload logic here
    console.log(
      "File uploaded for:",
      entryId,
      vendorId,
      event.target.files?.[0]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <InventorySidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Purchase Orders
          <span className="text-2xl font-normal text-gray-600 ml-2">
            (Items yet to be received from Vendor)
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchaseEntries.map((entry) => (
            <Card
              key={entry._id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-blue-600">
                    {entry.orderId}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {entry.isCompleted ? "Completed" : "Pending"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDetailsClick(entry)}
                      className="flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      Grand Total: Rs.{" "}
                      {entry.purchaseEntry
                        .reduce(
                          (total, purchase) =>
                            total + (purchase.grandTotal || 0),
                          0
                        )
                        .toFixed(2)}
                    </p>
                    <p>
                      Invoice No:{" "}
                      {entry.purchaseEntry
                        .map((purchase) => purchase.invoiceNo)
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </p>
                    <p>
                      Invoice Date:{" "}
                      {entry.purchaseEntry
                        .map((purchase) => purchase.invoiceDate)
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                Purchase Order Details
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh]">
              {selectedEntry?.purchaseEntry.map((purchase) => {
                const vendorDetails = getVendorDetails(purchase.vendorId);
                return (
                  <div
                    key={purchase._id}
                    className="mb-8 pb-8 border border-gray-200 rounded-lg p-4 last:mb-0"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-blue-600 underline-offset-1">
                        {vendorDetails?.vendorName || "Unknown Vendor"}
                      </h3>
                      <div>
                        <Label
                          htmlFor={`file-${selectedEntry._id}-${purchase.vendorId}`}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-2 hover:border-blue-500 transition-colors duration-300">
                            <Upload className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              Upload Files
                            </span>
                          </div>
                        </Label>
                        <Input
                          id={`file-${selectedEntry._id}-${purchase.vendorId}`}
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              selectedEntry._id,
                              purchase.vendorId,
                              e
                            )
                          }
                          multiple
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {vendorDetails?.vendorAddress}
                        </p>
                        <p>
                          <span className="font-medium">VAT:</span>{" "}
                          {vendorDetails?.vendorVAT}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {vendorDetails?.vendorPhone}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Invoice No:</span>{" "}
                          {purchase.invoiceNo || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Invoice Date:</span>{" "}
                          {purchase.invoiceDate || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Grand Total:</span> Rs.{" "}
                          {purchase.grandTotal?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-zinc-700">
                      Items
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchase.items.map((item) => {
                        const itemDetails = getItemDetails(item.itemId);
                        return (
                          <div
                            key={item.itemId}
                            className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                          >
                            <h5 className="font-semibold mb-2">
                              {itemDetails?.itemName || "Unknown Item"}
                            </h5>
                            <div className="text-sm">
                              <p>
                                <span className="font-medium">Type:</span>{" "}
                                {itemDetails?.type || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Quantity (Vendor):
                                </span>{" "}
                                {item.quantityFromVendor}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Quantity (Stock):
                                </span>{" "}
                                {item.quantityFromStock}
                              </p>
                              <p>
                                <span className="font-medium">Item Code:</span>{" "}
                                {item.itemCode || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Rate:</span> Rs.{" "}
                                {item.rate?.toFixed(2) || "N/A"}
                              </p>
                              <p>
                                <span className="font-medium">Amount:</span> Rs.{" "}
                                {item.amount?.toFixed(2) || "N/A"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PurchaseEntryList;
