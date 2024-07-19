"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import axios from "axios";
import html2canvas from 'html2canvas';
import InventorySidebar from "../Sidebar/InventorySidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from '../../images/LogoBG.webp';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Upload, RefreshCw, Send } from "lucide-react";
import { CheckCircle, CalendarDays } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import purchaseService from "@/app/services/purchaseOrderService";
import { purchaseEntryService } from "@/app/services/purchaseEntryList.service";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  is_issued: boolean | null;
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

interface IssueItemsPayload {
  order_id: string;
  approved_by: string;
  issued_date: string;
}

const PurchaseSlip: React.FC<{
  vendorDetails: Vendor | undefined;
  purchase: PurchaseEntryVendor;
  getItemDetails: (itemId: string) => Item | null;
}> = ({ vendorDetails, purchase, getItemDetails }) => {
  return (
    <div className="p-8 bg-white" id="purchase-slip">
      <div className="flex items-center mb-4">
        <img src={Logo.src} className="w-16 h-16 mr-4" />
        <h1 className="text-2xl font-bold">Wordscape Printing Company</h1>
      </div>
      <h2 className="text-2xl font-bold mb-4">Purchase Order Slip</h2>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{vendorDetails?.vendorName || 'Unknown Vendor'}</h2>
        <p>{vendorDetails?.vendorAddress || 'N/A'}</p>
        <p>VAT: {vendorDetails?.vendorVAT || 'N/A'}</p>
        <p>Phone: {vendorDetails?.vendorPhone || 'N/A'}</p>
      </div>
      <Table className="w-full mb-4">
        <th>
          <tr>
            <th className="text-left">Item</th>
            <th className="text-right">Quantity</th>
          </tr>
        </th>
        <tbody>
          {purchase.items.map((item, index) => {
            const itemDetails = getItemDetails(item.itemId);
            return (
              <tr key={index}>
                <td>{itemDetails?.itemName || 'Unknown Item'}</td>
                <td className="text-right">{item.quantityFromVendor}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

// PurchaseEntryList Component
const PurchaseEntryList: React.FC = () => {
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<PurchaseEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [orderId, setOrderId] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
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

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseEntriesResponse, inventoryResponse, vendorsResponse] =
          await Promise.all([
            purchaseEntryService.getPurchaseOrdersWithoutEntries(),
            purchaseEntryService.getInventoryItems(),
            purchaseEntryService.getVendors(),
          ]);

        const filteredPurchaseEntries = (purchaseEntriesResponse as PurchaseEntry[])
          .map((entry: PurchaseEntry) => ({
            ...entry,
            purchaseEntry: entry.purchaseEntry.filter(
              (purchase) => !purchase.isCompleted
            ),
          }))
          .filter((entry: PurchaseEntry) => entry.purchaseEntry.length > 0);

        setPurchaseEntries(filteredPurchaseEntries);
        setInventoryItems(inventoryResponse as InventoryItem[]);
        setVendors(vendorsResponse);
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

  const getItemDetails = (itemId: string): Item | null => {
    for (const inventory of inventoryItems) {
      const item = inventory.item.find((item) => item._id === itemId);
      if (item) {
        return item;
      }
    }
    return null;
  };

  const getVendorDetails = (vendorId: string): Vendor | undefined => {
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
      if (response.data && response.data.filename) {
        setVendorInputs((prevInputs) => ({
          ...prevInputs,
          [vendorId]: {
            ...prevInputs[vendorId],
            image: response.data.filename,
          },
        }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
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

    await toast.promise(
      axios.post(`http://127.0.0.1:8000/purchase_entry/${orderId}`, data),
      {
        loading: 'Creating Purchase Order',
        success: (response) => {
          console.log("Purchase Order created:", response.data);
          return "Purchase Order Placed Successfully";
        },
        error: "Error creating reorder",
      },
      {
        duration: 3000,
      }
    );
    setIsDetailsDialogOpen(false);
  };

  const handleIssueItems = async (orderId: string) => {
    setIsIssuing(true);
    setIssueError(null);
    const payload: IssueItemsPayload = {
      order_id: orderId,
      approved_by: "John Doe",
      issued_date: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/issued_item", payload);
      alert("Items issued successfully:");
    } catch (error) {
      console.error("Error issuing items:", error);
      setIssueError("Failed to issue items. Please try again.");
    } finally {
      setIsIssuing(false);
    }
  };

  const handleReorderClick = (orderId: string) => {
    router.push(`/inventory/entry/${orderId}?reorder=True`);
  };

  const handleleftOverClick = (orderId: string) => {
    router.push(`/inventory/leftover/${orderId}`);
  };

  const handleDownload = async (purchase: PurchaseEntryVendor) => {
    const vendorDetails = getVendorDetails(purchase.vendorId);

    // Create a temporary div to render the PurchaseSlip
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);

    // Render the PurchaseSlip component
    ReactDOM.render(
      <PurchaseSlip
        vendorDetails={vendorDetails}
        purchase={purchase}
        getItemDetails={getItemDetails}
      />,
      tempDiv
    );

    // Wait for the component to render
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Convert the rendered component to canvas
      const canvas = await html2canvas(tempDiv.firstChild as HTMLElement);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob as Blob))
      );

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `purchase_slip_${purchase.vendorId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating purchase slip:', error);
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
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
        <div className="grid grid-flow-cols grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
          {purchaseEntries.map((entry) => (
            <Card
              key={entry._id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 mr-[-20px]"
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
                        <>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIssueItems(entry.orderId)}
                                className="flex items-center ml-2"
                                disabled={isIssuing || entry.purchaseEntry.every(entry => entry.is_issued)}
                              >
                                {isIssuing ? (
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Issue Items
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold mb-2">Items that are not Issued</h4>
                                {entry.purchaseEntry.some(entry => entry.is_issued === null) ? (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[50%]">Item Name</TableHead>
                                        <TableHead>Quantity</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {entry.purchaseEntry.map((entry, index) =>
                                        entry.is_issued === null && entry.items.map((item, itemIndex) => (
                                          <TableRow key={`${index}-${itemIndex}`}>
                                            <TableCell className="font-medium">{getItemDetails(item.itemId)?.itemName}</TableCell>
                                            <TableCell>{item.quantityFromVendor}</TableCell>
                                          </TableRow>
                                        ))
                                      )}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <p className="text-sm text-muted-foreground">All items have been issued.</p>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleleftOverClick(entry.orderId)}
                            className="flex items-center ml-2"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Left Overs
                          </Button>
                        </>
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
                {entry.purchaseEntry.some(
                  (purchase) => purchase.tag === "reorder"
                ) && (
                    <div className="flex justify-end">
                      <Button
                        className="text-sm font-medium bg-transparent hover:bg-transparent text-orange-500"
                        onClick={() => handleReorderClick(entry.orderId)}
                      >
                        <RefreshCw className="mr-1 h-4 w-4" />
                        Reorder
                      </Button>
                    </div>
                  )}
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
                          <div className="flex items-center justify-center mr-[10px] border-2 border-dashed border-gray-300 rounded-md p-2 hover:border-blue-500 transition-colors duration-300">
                            <Upload className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              Proof of Payment
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
                    <div className="md:grid-cols-2 gap-4 mb-4">
                      <div className="grid gap-[5px] mt-[15px]">
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
                      <div className="flex flex-col gap-[10px]">
                        <div className="grid gap-[10px] shadow-md p-[20px]">
                          <Label>Image Url</Label>
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
                          <Label>Invoice No</Label>
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
                          <Label>Date</Label>
                          <Input
                            className=""
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
                          <div className="grid gap-[10px]">
                            <Label>VAT</Label>
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
                            <Label>Discount</Label>
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
                            <Label>Grand Total</Label>
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

                    <div className="flex items-center mt-[20px]">
                      <Button
                        type="submit"
                        onClick={() => handleSubmit(purchase.vendorId)}
                        className="flex items-center mr-3"
                      >
                        <div className="mr-[10px]">
                          <Send size={15} />
                        </div>
                        <div>
                          Submit
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(purchase)}
                        className="flex items-center"
                      >
                        Download Purchase Slip
                      </Button>
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