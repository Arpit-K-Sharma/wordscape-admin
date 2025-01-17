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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Info, SearchIcon } from "lucide-react";
import InventorySidebar from "../Sidebar/InventorySidebar";
import { Button } from "@/components/ui/button";
import reorderService from "@/app/services/inventoryServices/reorderService";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Item,
  PurchaseEntry,
  PurchaseOrder,
  Vendor,
  Items,
  InventoryItem,
  ApiResponse,
} from "../../Schema/reOrderSchema";
import { inventoryService } from "@/app/services/inventoryServices/inventoryservice";
import { vendorService } from "@/app/services/inventoryServices/vendorsService";

export function ReorderTable() {
  const [reorders, setReorders] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reordersRes, vendorsRes, inventoryRes] = await Promise.all([
          reorderService.getReorders(),
          vendorService.getVendors(),
          inventoryService.fetchInventory(),
        ]);
        console.log("Reorders response:", reordersRes);
        console.log("Vendors response:", vendorsRes);
        console.log("Inventory response:", inventoryRes);
        setReorders(reordersRes);
        setVendors(vendorsRes);
        setInventoryItems(inventoryRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find((v) => v._id === vendorId);
    return vendor ? vendor.vendorName : "Unknown Vendor";
  };

  const getItemName = (itemId: string) => {
    const item = inventoryItems.find((i) =>
      i.item.find((item) => item._id === itemId)
    );
    if (item) {
      const nestedItem = item.item.find((item) => item._id === itemId);
      return nestedItem ? nestedItem.itemName : "Unknown Item";
    }
    return "Unknown Item";
  };
  const filteredReorders = reorders
    ? reorders.filter((reorder) =>
        reorder.purchaseEntry.some((entry) =>
          getVendorName(entry.vendorId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      )
    : [];

  if (loading) {
    return <div>Loading...</div>;
  }

  const truncate = (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
  };

  const openRemarks = () => {
    setDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
      <InventorySidebar />
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <div className="flex">
            <h1 className="text-3xl font-bold mb-4 text-center mr-[80px]">
              Reordered Items{" "}
            </h1>
            <div className="mt-[-25px] ml-[-70px]">
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
                        This page provides an overview of the items that were
                        reordered for specific reasons.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </span>
            </div>
          </div>
          <div className="relative ">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by vendor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[white] w-full max-w-md border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800 hover:bg-gray-800">
                <TableHead className="font-semibold text-white px-6 py-3">
                  Vendor
                </TableHead>
                <TableHead className="font-semibold text-white px-6 py-3">
                  Order ID
                </TableHead>
                <TableHead className="font-semibold text-white px-6 py-3">
                  Items
                </TableHead>
                <TableHead className="font-semibold text-white px-6 py-3">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-white px-6 py-3">
                  Total reorder
                </TableHead>
                <TableHead className="font-semibold text-white px-6 py-3 text-center">
                  Remarks
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reorders ? (
                filteredReorders.length > 0 ? (
                  filteredReorders.flatMap((reorder) =>
                    reorder.purchaseEntry.map((entry, entryIndex) => (
                      <TableRow
                        key={`${reorder.orderId}-${entryIndex}`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="px-6 py-4">
                          {getVendorName(entry.vendorId)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {truncate(reorder.orderId, 10)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <ul className="list-disc list-inside">
                            {entry.items.map((item, itemIndex) => (
                              <li
                                key={`${item.itemId}-${itemIndex}`}
                                className="text-sm"
                              >
                                {getItemName(item.itemId)} - Qty:{" "}
                                {item.quantityFromVendor}
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              entry.isCompleted
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {entry.isCompleted ? "Completed" : "Pending"}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {entry.grandTotal ?? "N/A"}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex justify-center">
                            <Button
                              onClick={() => openRemarks()}
                              className="bg-[#eeeeee] text-[#4f4f4f] font-semibold hover:bg-[white]"
                            >
                              View Remarks
                            </Button>
                          </div>
                          <Dialog
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                          >
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Remarks Details</DialogTitle>
                                <DialogDescription>
                                  {entry.remarks}
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No matching reorders found
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className=" pl-[150px] text-center py-8 text-gray-500"
                  >
                    No reorders available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
