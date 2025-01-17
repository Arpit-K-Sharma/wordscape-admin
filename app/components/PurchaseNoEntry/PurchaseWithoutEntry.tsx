"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import html2canvas from "html2canvas";
import InventorySidebar from "../Sidebar/InventorySidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRoot } from "react-dom/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  Upload,
  RefreshCw,
  Send,
  Info,
  FolderDown,
  PackagePlus,
  PackageCheck,
  Package,
} from "lucide-react";
import { CheckCircle, CalendarDays } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { purchaseEntryService } from "@/app/services/inventoryServices/purchaseEntryService";
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
} from "@/components/ui/table";
import { LiaHourglassStartSolid } from "react-icons/lia";
import jsPDF from "jspdf";
import {
  PurchaseEntryItem,
  PurchaseEntryVendor,
  PurchaseEntry,
  Item,
  InventoryItem,
  Vendor,
  IssueItemsPayload,
} from "../../Schema/purchaseWithoutEntry";
import PurchaseSlip from "./purchaseSlip";
import { VendorInput } from "../../Schema/purchaseEntrySchema";
import { vendorService } from "@/app/services/inventoryServices/vendorsService";
import { inventoryService } from "@/app/services/inventoryServices/inventoryservice";
// Deployment
const PurchaseEntryList: React.FC = () => {
  const [purchaseEntries, setPurchaseEntries] = useState<PurchaseEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<PurchaseEntry | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [orderId, setOrderId] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [vendorInputs, setVendorInputs] = useState<{
    [purchaseEntryId: string]: VendorInput;
  }>({});

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseEntriesResponse, inventoryResponse, vendorsResponse] =
          await Promise.all([
            purchaseEntryService.getPurchaseOrdersWithoutEntries(),
            inventoryService.fetchInventory(),
            vendorService.getVendors(),
          ]);

        setPurchaseEntries(purchaseEntriesResponse);
        setInventoryItems(inventoryResponse);
        setVendors(vendorsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reload]);

  const handleDetailsClick = (entry: PurchaseEntry) => {
    setOrderId(entry.orderId);
    setSelectedEntry(entry);
    setIsDetailsDialogOpen(true);

    const newVendorInputs = entry.purchaseEntry.reduce((acc, purchase) => {
      acc[purchase._id] = {
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
    console.log(vendors);
    return vendors.find((vendor) => vendor._id === vendorId);
  };

  const handleFileUpload = async (
    purchaseEntryId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const filename = await purchaseEntryService.uploadImage(file);
      setVendorInputs((prevInputs) => ({
        ...prevInputs,
        [purchaseEntryId]: {
          ...prevInputs[purchaseEntryId],
          image: filename,
        },
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async (purchaseEntryId: string) => {
    if (!selectedEntry) return;

    const vendorPurchaseEntry = selectedEntry.purchaseEntry.find(
      (p) => p._id === purchaseEntryId
    );
    if (!vendorPurchaseEntry) return;

    const vendorInput = vendorInputs[purchaseEntryId];
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
      purchaseEntryService.createPurchaseEntry(orderId, data),
      {
        loading: "Creating Purchase Order",
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
    setReload(reload + 1);
  };

  const handleIssueItems = async (orderId: string) => {
    setIsIssuing(true);
    setIssueError(null);
    const payload: IssueItemsPayload = {
      order_id: orderId,
      approved_by: "John Doe",
      issued_date: new Date().toISOString().split("T")[0],
    };

    try {
      await toast.promise(
        purchaseEntryService.issueItems(payload),
        {
          loading: "Issuing Items",
          success: (response) => {
            return "Item Issued Successfully";
          },
          error: "Error Issuing Item",
        },
        {
          duration: 3000,
        }
      );
      setReload(reload + 1);
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
    const tempDiv = document.createElement("div");
    document.body.appendChild(tempDiv);

    const handleDownload = async (purchase: PurchaseEntryVendor) => {
      const vendorDetails = getVendorDetails(purchase.vendorId);
      const tempDiv = document.createElement("div");
      document.body.appendChild(tempDiv);

      const root = createRoot(tempDiv);
      root.render(
        <PurchaseSlip
          vendorDetails={vendorDetails}
          purchase={purchase}
          getItemDetails={getItemDetails}
        />
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const canvas = await html2canvas(tempDiv.firstChild as HTMLElement, {
          scale: 3,
        });
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const widthRatio = pdfWidth / canvas.width;
        const heightRatio = pdfHeight / canvas.height;
        const ratio = Math.min(widthRatio, heightRatio);
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          canvas.width * ratio,
          canvas.height * ratio
        );
        pdf.save(`purchase_slip_${purchase.vendorId}.pdf`);
      } catch (error) {
        console.error("Error generating purchase slip:", error);
      } finally {
        root.unmount();
        document.body.removeChild(tempDiv);
      }
    };
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(tempDiv.firstChild as HTMLElement, {
        scale: 3,
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const widthRatio = pdfWidth / canvas.width;
      const heightRatio = pdfHeight / canvas.height;
      const ratio = Math.min(widthRatio, heightRatio);
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        canvas.width * ratio,
        canvas.height * ratio
      );
      pdf.save(`purchase_slip_${purchase.vendorId}.pdf`);
    } catch (error) {
      console.error("Error generating purchase slip:", error);
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
      <InventorySidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex flex-row">
          <div className="text-3xl font-bold mb-6 text-gray-800">
            <h1>Purchase Orders</h1>
          </div>
          <div className="mt-[-25px] ml-[10px]">
            <span className="text-2xl font-normal text-gray-600 ml-2">
              <HoverCard>
                <HoverCardTrigger>
                  <Info className="hover:cursor-pointer hover:text-blue-900" />
                </HoverCardTrigger>
                <HoverCardContent className="w-[300px] rounded-[20px]">
                  <div className="p-[10px] items-center justify-center font-archivo">
                    <h1 className="ml-[20px] font-semibold mb-[10px] text-[15px] text-gray-700">
                      Information
                    </h1>
                    <p className=" ml-[20px] text-left text-gray-600 text-[15px]">
                      This page allows you to view all purchase orders that have
                      been created without entires.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </span>
          </div>
        </div>

        <div className="grid grid-flow-cols grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
          {purchaseEntries &&
            purchaseEntries.map((entry) => (
              <Card
                key={entry._id}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 mr-[5px] "
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-blue-600">
                      {entry.orderId}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {entry.isCompleted ? (
                        <HoverCard>
                          <HoverCardTrigger>
                            <PackageCheck
                              size={22}
                              className="hover:cursor-pointer hover:text-green-800"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-[300px] rounded-[20px]">
                            <div className="p-[10px] items-center justify-center font-archivo">
                              <h1 className="ml-[20px] font-semibold mb-[10px] text-[15px] text-gray-700">
                                Order Completed
                              </h1>
                              <p className=" ml-[20px] text-left text-gray-600 text-[15px]">
                                This order has been completed.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ) : (
                        <HoverCard>
                          <HoverCardTrigger>
                            <LiaHourglassStartSolid
                              size={22}
                              className="hover:cursor-pointer hover:text-yellow-600"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-[300px] rounded-[20px]">
                            <div className="p-[10px] items-center justify-center font-archivo">
                              <h1 className="ml-[20px] font-semibold mb-[10px] text-[15px] text-gray-700">
                                Order Pending
                              </h1>
                              <p className=" ml-[20px] text-left text-gray-600 text-[15px]">
                                This order is pending.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 ">
                    <div className="flex justify-between ml-[-13.5px]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDetailsClick(entry)}
                        className="flex  items-center"
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
                                className="flex  items-center ml-1"
                                disabled={
                                  isIssuing ||
                                  entry.purchaseEntry.every(
                                    (entry) =>
                                      entry.is_issued ||
                                      entry.isCompleted === false
                                  )
                                }
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
                                <h4 className="text-sm font-semibold mb-2">
                                  Items that are not Issued
                                </h4>
                                {entry.purchaseEntry.some(
                                  (entry) => entry.is_issued === null
                                ) ? (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[50%]">
                                          Item Name
                                        </TableHead>
                                        <TableHead>Quantity</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {entry.purchaseEntry.map(
                                        (entry, index) =>
                                          entry.is_issued === null &&
                                          entry.isCompleted === true &&
                                          entry.items.map((item, itemIndex) => (
                                            <TableRow
                                              key={`${index}-${itemIndex}`}
                                            >
                                              <TableCell className="font-medium">
                                                {
                                                  getItemDetails(item.itemId)
                                                    ?.itemName
                                                }
                                              </TableCell>
                                              <TableCell>
                                                {item.quantityFromVendor}
                                              </TableCell>
                                            </TableRow>
                                          ))
                                      )}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    All items have been issued.
                                  </p>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleleftOverClick(entry.orderId)}
                            className="flex items-center ml-1"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Left Overs
                          </Button>
                        </>
                      )}
                    </div>
                    {/* <h2>Bill</h2> */}
                    <div className="text-sm text-gray-600 p-4 shadow-sm border border-gray-200 rounded-md space-y-2">
                      <p className="flex justify-between">
                        <span>Grand Total:</span>
                        <span className="font-semibold">
                          Rs.{" "}
                          {entry.purchaseEntry
                            .reduce(
                              (total, purchase) =>
                                total + (purchase.grandTotal || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Invoice No:</span>
                        <span className="font-semibold">
                          {entry.purchaseEntry
                            .map((purchase) => purchase.invoiceNo)
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Invoice Date:</span>
                        <span className="font-semibold">
                          {entry.purchaseEntry
                            .map((purchase) => purchase.invoiceDate)
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </span>
                      </p>
                      {entry.purchaseEntry.some((purchase) => purchase.tag) && (
                        <p className="flex justify-between">
                          <span>Tags:</span>
                          <span className="font-semibold">
                            {Object.entries(
                              entry.purchaseEntry
                                .map((purchase) => purchase.tag)
                                .filter((tag): tag is string => Boolean(tag))
                                .reduce<Record<string, number>>((acc, tag) => {
                                  acc[tag] = (acc[tag] || 0) + 1;
                                  return acc;
                                }, {})
                            )
                              .map(
                                ([tag, count]) =>
                                  `${tag}${count > 1 ? ` (${count})` : ""}`
                              )
                              .join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  {entry.purchaseEntry.some(
                    (purchase) => purchase.tag === "reorder"
                  ) && (
                    <div className="flex justify-end mt-[10px]">
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
                return purchase.isCompleted === false ? (
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
                          id={`file-${selectedEntry._id}-${purchase._id}`}
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(purchase._id, e)}
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
                            value={vendorInputs[purchase._id]?.image || ""}
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase._id]: {
                                  ...prev[purchase._id],
                                  image: e.target.value,
                                },
                              }))
                            }
                          />
                          <Label>Invoice No</Label>
                          <Input
                            placeholder="Invoice No"
                            value={vendorInputs[purchase._id]?.invoiceNo || ""}
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase._id]: {
                                  ...prev[purchase._id],
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
                              vendorInputs[purchase._id]?.invoiceDate || ""
                            }
                            onChange={(e) =>
                              setVendorInputs((prev) => ({
                                ...prev,
                                [purchase._id]: {
                                  ...prev[purchase._id],
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
                              value={vendorInputs[purchase._id]?.vat || ""}
                              onChange={(e) =>
                                setVendorInputs((prev) => ({
                                  ...prev,
                                  [purchase._id]: {
                                    ...prev[purchase._id],
                                    vat: e.target.value,
                                  },
                                }))
                              }
                            />
                            <Label>Discount</Label>
                            <Input
                              type="number"
                              placeholder="Discount"
                              value={vendorInputs[purchase._id]?.discount || ""}
                              onChange={(e) =>
                                setVendorInputs((prev) => ({
                                  ...prev,
                                  [purchase._id]: {
                                    ...prev[purchase._id],
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
                                vendorInputs[purchase._id]?.grandTotal || ""
                              }
                              onChange={(e) =>
                                setVendorInputs((prev) => ({
                                  ...prev,
                                  [purchase._id]: {
                                    ...prev[purchase._id],
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
                                    vendorInputs[purchase._id]?.items[index]
                                      ?.rate || ""
                                  }
                                  onChange={(e) =>
                                    setVendorInputs((prev) => ({
                                      ...prev,
                                      [purchase._id]: {
                                        ...prev[purchase._id],
                                        items: prev[purchase._id].items.map(
                                          (item, i) =>
                                            i === index
                                              ? {
                                                  ...item,
                                                  rate: e.target.value,
                                                }
                                              : item
                                        ),
                                      },
                                    }))
                                  }
                                />
                                <Input
                                  placeholder="Item Code"
                                  value={
                                    vendorInputs[purchase._id]?.items[index]
                                      ?.code || ""
                                  }
                                  onChange={(e) =>
                                    setVendorInputs((prev) => ({
                                      ...prev,
                                      [purchase._id]: {
                                        ...prev[purchase._id],
                                        items: prev[purchase._id].items.map(
                                          (item, i) =>
                                            i === index
                                              ? {
                                                  ...item,
                                                  code: e.target.value,
                                                }
                                              : item
                                        ),
                                      },
                                    }))
                                  }
                                />
                                <Input
                                  placeholder="Amount"
                                  value={
                                    vendorInputs[purchase._id]?.items[index]
                                      ?.amount || ""
                                  }
                                  onChange={(e) =>
                                    setVendorInputs((prev) => ({
                                      ...prev,
                                      [purchase._id]: {
                                        ...prev[purchase._id],
                                        items: prev[purchase._id].items.map(
                                          (item, i) =>
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
                        onClick={() => handleSubmit(purchase._id)}
                        className="flex items-center mr-3"
                      >
                        <div className="mr-[10px]">
                          <Send size={15} />
                        </div>
                        <div>Submit</div>
                      </Button>
                      <Button
                        onClick={() => handleDownload(purchase)}
                        className="bg-black text-white flex items-center hover:bg-gray-800"
                      >
                        <div className="flex flex-row">
                          <div>
                            <FolderDown size={18} />
                          </div>
                          <div className="ml-[10px]">Download</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                ) : null;
              })}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PurchaseEntryList;
