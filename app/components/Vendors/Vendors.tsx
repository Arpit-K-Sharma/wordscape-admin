"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VendorForm from "./VendorForm";
import UpdateVendorDialog from "./UpdateVendorDialog";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import InventorySidebar from "../Sidebar/InventorySidebar";

interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      const response = await axios.get<{ status: string; data: Vendor[] }>(
        "http://localhost:8000/vendors"
      );
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        setVendors(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setVendors([]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const onSubmit = async (data: Omit<Vendor, "_id">) => {
    try {
      const url = "http://localhost:8000/vendors";
      const response = await axios.post<Vendor>(url, data);
      console.log("Vendor created", response.data);
      setVendors([...vendors, response.data]);
      setIsAddDialogOpen(false);
      await fetchVendors();
    } catch (error) {
      console.error("Error occurred while creating a vendor:", error);
    }
  };

  const openUpdateDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    fetchVendors();
    setSelectedVendor(null);
  };

  const openDeleteDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedVendor(null);
  };

  const handleVendorDelete = async () => {
    if (!selectedVendor) return;
    try {
      const url = `http://127.0.0.1:8000/vendors/${selectedVendor._id}`;
      const response = await axios.delete<{ status: string }>(url);
      if (response.data.status === "success") {
        console.log("Vendor deleted", response.data);
        setVendors(vendors.filter((v) => v._id !== selectedVendor._id));
        closeDeleteDialog();
        fetchVendors();
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error occurred while deleting the vendor:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white-50">
      <InventorySidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-5 py-8 font-archivo">
          <h1 className="flex items-center justify-center text-5xl font-bold text-gray-900 mb-8 mx-auto">
            Vendors
          </h1>
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center justify-center"
            >
              Add Vendor
            </Button>
          </div>

          <Table className="w-full">
            <TableCaption>A list of WordScape's vendors.</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-800 hover:bg-gray-800">
                <TableHead className="font-bold text-white text-center">
                  Name
                </TableHead>
                <TableHead className="font-bold text-white text-center">
                  Address
                </TableHead>
                <TableHead className="font-bold text-white text-center">
                  VAT
                </TableHead>
                <TableHead className="font-bold text-white text-center">
                  Phone
                </TableHead>
                <TableHead className="text-center text-white">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell className="text-center">
                    {vendor.vendorName}
                  </TableCell>
                  <TableCell className="text-center">
                    {vendor.vendorAddress}
                  </TableCell>
                  <TableCell className="text-center">
                    {vendor.vendorVAT}
                  </TableCell>
                  <TableCell className="text-center">
                    {vendor.vendorPhone}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      className="mr-4 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors"
                      onClick={() => openUpdateDialog(vendor)}
                    >
                      <FiEdit2 className="mr-1" /> Update
                    </Button>
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 transition-colors"
                      onClick={() => openDeleteDialog(vendor)}
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add Vendor Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
              </DialogHeader>
              <VendorForm onSubmit={onSubmit} buttonText="Add Vendor" />
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="w-full bg-red-700 text-white hover:bg-red-900 hover:text-white"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Update Vendor Dialog */}
          {selectedVendor && (
            <UpdateVendorDialog
              isOpen={isUpdateDialogOpen}
              closeModal={closeUpdateDialog}
              vendor={selectedVendor}
            />
          )}

          {/* Delete Vendor Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Vendor</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this vendor? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={handleVendorDelete}>
                  <FiTrash2 className="mr-2" />
                  Delete
                </Button>
                <Button variant="secondary" onClick={closeDeleteDialog}>
                  <FiX className="mr-2" />
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}

export default Vendors;
