"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import InventorySidebar from "../Sidebar/InventorySidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, RefreshCw, CheckCircle, CalendarDays, Info } from "lucide-react";
import Logo from "../../images/LogoBG.webp";
import { purchaseEntryService } from "@/app/services/inventoryServices/purchaseEntryService";
import { vendorService } from "@/app/services/inventoryServices/vendorsService";
import { Package } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { inventoryService } from "@/app/services/inventoryServices/inventoryservice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PurchaseOrder,
  InventoryItem,
  Vendor,
  IssueItemsPayload,
} from "../../Schema/purchaseWithEntrySchema";

const PurchaseWithEntry: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    null
  );
  const router = useRouter();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loader, setLoader] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [reload, setReload] = useState(0);
  const [issueError, setIssueError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseOrders, inventoryItems, vendors] = await Promise.all([
          purchaseEntryService.getPurchaseOrders(),
          inventoryService.fetchInventory(),
          vendorService.getVendors(),
        ]);
        console.log(purchaseOrders);
        setPurchaseOrders(purchaseOrders);
        setInventoryItems(inventoryItems);
        setVendors(vendors);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [reload]);

  const handleDetailsClick = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const getItemDetails = (itemId: string) => {
    return inventoryItems.find((item) => item._id === itemId);
  };

  const getVendorDetails = (vendorId: string) => {
    return vendors.find((vendor) => vendor._id === vendorId);
  };

  const handleReorderClick = (orderId: string) => {
    router.push(`/inventory/entry/${orderId}?reorder=True`);
  };

  const handleleftOverClick = (orderId: string) => {
    router.push(`/inventory/leftover/${orderId}`);
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const contentRef = useRef<HTMLDivElement>(null);

  const handleIssueItems = async (orderId: string) => {
    setIsIssuing(true);
    setIssueError(null);
    console.log(orderId);
    const payload: IssueItemsPayload = {
      order_id: orderId,
      approved_by: "John Doe",
      issued_date: new Date().toISOString().split("T")[0],
    };

    try {
      await toast.promise(
        axios.post(`${BASE_URL}/issued_item`, payload),
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

  const getItemName = (itemId: string): string => {
    console.log(itemId);
    for (const inventoryItem of inventoryItems) {
      console.log(inventoryItem, "this is", itemId);
      const foundItem = inventoryItem.item.find((item) => item._id == itemId);
      if (foundItem) {
        return foundItem.itemName;
      }
    }
    return "Unknown Item";
  };
  const getItemType = (itemId: string): string => {
    for (const inventoryItem of inventoryItems) {
      if (inventoryItem.item.some((item) => item._id === itemId)) {
        return inventoryItem.type;
      }
    }
    return "N/A";
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
                      been created with entires.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </span>
          </div>
        </div>
        <div className="grid grid-flow-cols grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
          {Array.isArray(purchaseOrders) && purchaseOrders.length > 0 ? (
            <div>
              {purchaseOrders &&
                purchaseOrders.map((order) => (
                  <Card
                    key={order._id}
                    className="shadow-lg hover:shadow-xl transition-shadow duration-300 mb-[20px] mr-[-20px] "
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-blue-600 truncate w-[250px]">
                          {order.orderId}
                        </span>
                        <span className="text-sm font-medium text-green-800 ">
                          {order.isCompleted ? "Completed" : "Pending"}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDetailsClick(order)}
                            className="flex items-center"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIssueItems(order.orderId)}
                                className="flex items-center ml-2"
                                disabled={
                                  isIssuing ||
                                  order.purchaseEntry.every(
                                    (entry) => entry.is_issued
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
                                {order.purchaseEntry.some(
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
                                      {order.purchaseEntry.map(
                                        (entry, index) =>
                                          entry.is_issued === null &&
                                          entry.items.map((item, itemIndex) => (
                                            <TableRow
                                              key={`${index}-${itemIndex}`}
                                            >
                                              <TableCell className="font-medium">
                                                {getItemName(item.itemId)}
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
                            onClick={() => handleleftOverClick(order.orderId)}
                            className="flex items-center ml-2"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Left Overs
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            Grand Total: Rs.{" "}
                            {order.purchaseEntry
                              .reduce(
                                (total, purchase) =>
                                  total + (purchase.grandTotal || 0),
                                0
                              )
                              .toFixed(2)}
                          </p>
                          <p>
                            Invoice No:{" "}
                            {order.purchaseEntry
                              .map((purchase) => purchase.invoiceNo)
                              .filter(Boolean)
                              .join(", ") || "N/A"}
                          </p>
                          <p>
                            Invoice Date:{" "}
                            {order.purchaseEntry
                              .map((purchase) => purchase.invoiceDate)
                              .filter(Boolean)
                              .join(", ") || "N/A"}
                          </p>
                          {order.purchaseEntry.some(
                            (purchase) => purchase.tag
                          ) && (
                            <p>
                              Tags:{" "}
                              {order.purchaseEntry
                                .map((purchase) => purchase.tag)
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                          <span
                            className="text-sm font-medium mt-[5px] cursor-pointer text-orange-500 flex justify-end"
                            onClick={() => handleReorderClick(order.orderId)}
                          >
                            <RefreshCw className="mr-1 h-4 w-4" />
                            Reorder
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <p>No purchase orders available.</p>
          )}
        </div>
        <div className="print-slip">
          <Dialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
          >
            <DialogContent className="print max-w-4xl font-archivo">
              <div ref={contentRef}>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-gray-800 mb-4">
                    <div className="flex flex-col items-center justify-center">
                      <div>
                        <img src={Logo.src} width={100} />
                      </div>
                      <div>Purchase Order Details</div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="print h-[60vh]">
                  {selectedOrder?.purchaseEntry.map((purchase) => {
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
                              <span className="font-medium">Grand Total:</span>{" "}
                              Rs. {purchase.grandTotal?.toFixed(2) || "N/A"}
                            </p>
                            {purchase.tag && (
                              <p>
                                <span className="font-medium">Tag:</span>{" "}
                                {purchase.tag}
                              </p>
                            )}
                            {purchase.remarks && (
                              <p>
                                <span className="font-medium">Remarks:</span>{" "}
                                {purchase.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                        <h4 className="text-lg font-bold mb-2 text-zinc-800">
                          Items
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {purchase.items.map((item) => (
                            <div
                              key={item.itemId}
                              className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                            >
                              <h5 className="font-semibold mb-2 flex justify-between items-center">
                                <span>{getItemName(item.itemId)}</span>
                              </h5>
                              <div className="text-sm">
                                <p>
                                  <span className="font-medium">Type:</span>{" "}
                                  {getItemType(item.itemId)}
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
                                  <span className="font-medium">
                                    Item Code:
                                  </span>{" "}
                                  {item.itemCode || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Rate:</span> Rs.{" "}
                                  {item.rate?.toFixed(2) || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Amount:</span>{" "}
                                  Rs. {item.amount?.toFixed(2) || "N/A"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PurchaseWithEntry;
