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
import { Eye, Upload, RefreshCw } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { Toast } from "@/components/ui/toast";

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

interface PurchaseEntry {
  _id: string;
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: PurchaseEntryVendor[];
}
interface Item {
  _id: string;
  itemName: string;
  availability: number;
}
interface InventoryItem {
  _id: string;
  type: string;
  item: Item[];
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
  const [orderId, setOrderId] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorInputs, setVendorInputs] = useState<{
    [vendorId: string]: {
      invoiceNo: string;
      invoiceDate: string;
      grandTotal: string;
      vat: string;
      discount: string;
      image: string;
      items: { rate: string; code: string; amount: string }[];
    };
  }>({});
  // const { toast } = useToast();

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
          const filteredPurchaseEntries = purchaseEntriesResponse.data.data
            .map((entry) => ({
              ...entry,
              purchaseEntry: entry.purchaseEntry.filter(
                (purchase) => !purchase.isCompleted
              ),
            }))
            .filter((entry) => entry.purchaseEntry.length > 0);

          setPurchaseEntries(filteredPurchaseEntries);
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
    setOrderId(entry.orderId);
    setSelectedEntry(entry);
    setIsDetailsDialogOpen(true);

    const newVendorInputs = entry.purchaseEntry.reduce((acc, purchase) => {
      acc[purchase.vendorId] = {
        invoiceNo: "",
        invoiceDate: "",
        grandTotal: "",
        vat: "",
        discount: "",
        image: "",
        items: purchase.items.map(() => ({ rate: "", code: "", amount: "" })),
      };
      return acc;
    }, {} as typeof vendorInputs);

    setVendorInputs(newVendorInputs);
  };

  const getItemDetails = (itemId: string) => {
    for (const inventory of inventoryItems) {
      const item = inventory.item.find((item) => item._id === itemId);
      if (item) {
        return item;
      }
    }
    return null;
  };

  const getVendorDetails = (vendorId: string) => {
    return vendors.find((vendor) => vendor._id === vendorId);
  };

  const handleFileUpload = async (
    vendorId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      if (response.data && response.data.filename) {
        setVendorInputs((prevInputs) => ({
          ...prevInputs,
          [vendorId]: {
            ...prevInputs[vendorId],
            image: response.data.filename,
          },
        }));

        toast({
          title: "Image Uploaded Successfully",
          description: `File: ${response.data.filename}`,
        });

        console.log(
          `File uploaded successfully for vendor ${vendorId}. Filename: ${response.data.filename}`
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Image Upload Failed",
        description: "There was an error uploading the image.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (vendorId: string) => {
    if (!selectedEntry) return;

    const vendorPurchaseEntry = selectedEntry.purchaseEntry.find(
      (p) => p.vendorId === vendorId
    );
    if (!vendorPurchaseEntry) return;

    const vendorInput = vendorInputs[vendorId];
    if (!vendorInput) return;

    const data = {
      purchaseEntryId: vendorPurchaseEntry._id,
      items: vendorInput.items.map((item, index) => ({
        code: item.code,
        inventoryId: vendorPurchaseEntry.items[index].inventoryId,
        itemId: vendorPurchaseEntry.items[index].itemId,
        productName:
          getItemDetails(vendorPurchaseEntry.items[index].itemId)?.itemName ||
          "",
        quantity: vendorPurchaseEntry.items[index].quantityFromVendor,
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount),
      })),
      image: vendorInput.image,
      discount: parseFloat(vendorInput.discount) || 0,
      vat: parseFloat(vendorInput.vat) || 0,
      grandTotal: parseFloat(vendorInput.grandTotal),
      invoiceNo: vendorInput.invoiceNo,
      invoiceDate: vendorInput.invoiceDate,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/purchase_entry/${orderId}`,
        data
      );
      console.log("API response:", response.data);
      if (response.status === 200) {
        if (selectedEntry) {
          const updatedPurchaseEntry = selectedEntry.purchaseEntry.filter(
            (purchase) => purchase.vendorId !== vendorId
          );

          setSelectedEntry({
            ...selectedEntry,
            purchaseEntry: updatedPurchaseEntry,
          });

          const { [vendorId]: _, ...restVendorInputs } = vendorInputs;
          setVendorInputs(restVendorInputs);

          if (updatedPurchaseEntry.length === 0) {
            setIsDetailsDialogOpen(false);
          }
          setPurchaseEntries((prevEntries) =>
            prevEntries.map((entry) =>
              entry._id === selectedEntry._id
                ? { ...entry, purchaseEntry: updatedPurchaseEntry }
                : entry
            )
          );
        }
      }
    } catch (error) {
      console.error("Error submitting purchase entry:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
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
                    {entry.purchaseEntry.some(
                      (purchase) => purchase.tag === "reorder"
                    ) && (
                      <span className="text-sm font-medium text-orange-500 flex items-center">
                        <RefreshCw className="mr-1 h-4 w-4" />
                        Reorder
                      </span>
                    )}
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
                    {entry.purchaseEntry.some((purchase) => purchase.tag) && (
                      <p>
                        Tags:{" "}
                        {entry.purchaseEntry
                          .map((purchase) => purchase.tag)
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
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
          <DialogContent className="max-w-4xl font-archivo">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-gray-800 mb-4">
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
                      <h3 className="text-2xl font-black text-zinc-900 underline-offset-1">
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
                              Upload Bill
                            </span>
                          </div>
                        </Label>
                        <Input
                          id={`file-${selectedEntry._id}-${purchase.vendorId}`}
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(purchase.vendorId, e)
                          }
                          multiple
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="grid gap-[10px] mt-[15px]">
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
                      <div className="flex gap-[10px]">
                        <div className="grid gap-[10px]">
                          <Input
                            type="text"
                            placeholder="Image URL"
                            value={vendorInputs[purchase.vendorId]?.image || ""}
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase.vendorId]: {
                                  ...prev[purchase.vendorId],
                                  image: e.target.value,
                                },
                              }))
                            }
                          />
                          <Input
                            placeholder="Invoice No"
                            value={
                              vendorInputs[purchase.vendorId]?.invoiceNo || ""
                            }
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase.vendorId]: {
                                  ...prev[purchase.vendorId],
                                  invoiceNo: e.target.value,
                                },
                              }))
                            }
                          />
                          <Input
                            type="date"
                            placeholder="Invoice Date"
                            value={
                              vendorInputs[purchase.vendorId]?.invoiceDate || ""
                            }
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase.vendorId]: {
                                  ...prev[purchase.vendorId],
                                  invoiceDate: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-[10px]">
                          <Input
                            type="number"
                            placeholder="VAT"
                            value={vendorInputs[purchase.vendorId]?.vat || ""}
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase.vendorId]: {
                                  ...prev[purchase.vendorId],
                                  vat: e.target.value,
                                },
                              }))
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Discount"
                            value={
                              vendorInputs[purchase.vendorId]?.discount || ""
                            }
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase.vendorId]: {
                                  ...prev[purchase.vendorId],
                                  discount: e.target.value,
                                },
                              }))
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Grand Total"
                            value={
                              vendorInputs[purchase.vendorId]?.grandTotal || ""
                            }
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase.vendorId]: {
                                  ...prev[purchase.vendorId],
                                  grandTotal: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-zinc-800">
                      Items
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchase.items.map((item, index) => {
                        const itemDetails = getItemDetails(item.itemId);
                        return (
                          <div
                            key={item.itemId}
                            className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                          >
                            <h5 className="font-semibold mb-2 flex justify-between items-center">
                              <span>
                                {itemDetails?.itemName || "Unknown Item"}
                              </span>
                              {purchase.tag === "reorder" && (
                                <span className="text-xs font-medium text-orange-500 flex items-center">
                                  <RefreshCw className="mr-1 h-3 w-3" />
                                  Reordered
                                </span>
                              )}
                            </h5>
                            <div className="text-sm grid gap-[10px]">
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
                              <div className="grid gap-[10px]">
                                <Input
                                  placeholder="Item Rate"
                                  value={
                                    vendorInputs[purchase.vendorId]?.items[
                                      index
                                    ]?.rate || ""
                                  }
                                  onChange={(e) =>
                                    setVendorInputs((prev) => ({
                                      ...prev,
                                      [purchase.vendorId]: {
                                        ...prev[purchase.vendorId],
                                        items: prev[
                                          purchase.vendorId
                                        ].items.map((item, i) =>
                                          i === index
                                            ? { ...item, rate: e.target.value }
                                            : item
                                        ),
                                      },
                                    }))
                                  }
                                />
                                <Input
                                  placeholder="Item Code"
                                  value={
                                    vendorInputs[purchase.vendorId]?.items[
                                      index
                                    ]?.code || ""
                                  }
                                  onChange={(e) =>
                                    setVendorInputs((prev) => ({
                                      ...prev,
                                      [purchase.vendorId]: {
                                        ...prev[purchase.vendorId],
                                        items: prev[
                                          purchase.vendorId
                                        ].items.map((item, i) =>
                                          i === index
                                            ? { ...item, code: e.target.value }
                                            : item
                                        ),
                                      },
                                    }))
                                  }
                                />
                                <Input
                                  placeholder="Amount"
                                  value={
                                    vendorInputs[purchase.vendorId]?.items[
                                      index
                                    ]?.amount || ""
                                  }
                                  onChange={(e) =>
                                    setVendorInputs((prev) => ({
                                      ...prev,
                                      [purchase.vendorId]: {
                                        ...prev[purchase.vendorId],
                                        items: prev[
                                          purchase.vendorId
                                        ].items.map((item, i) =>
                                          i === index
                                            ? {
                                                ...item,
                                                amount: e.target.value,
                                              }
                                            : item
                                        ),
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      onClick={() => handleSubmit(purchase.vendorId)}
                      className="mt-4"
                    >
                      Submit
                    </Button>
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
