"use client";

import React, { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import VendorForm from "./VendorForm";
import UpdateVendorDialog from "./UpdateVendorDialog";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import InventorySidebar from "../Sidebar/InventorySidebar";
import { vendorService } from "@/app/services/vendorService";

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
      const vendors = await vendorService.getVendors();
      setVendors(vendors);
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
      const newVendor = await vendorService.createVendor(data);
      setVendors([...vendors, newVendor]);
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
      await vendorService.deleteVendor(selectedVendor._id);
      setVendors(vendors.filter((v) => v._id !== selectedVendor._id));
      closeDeleteDialog();
      await fetchVendors();
    } catch (error) {
      console.error("Error occurred while deleting the vendor:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white-50">
      <InventorySidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-5 py-8 font-archivo">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Vendors
      </h1>
      <div className="flex justify-start mb-4">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          Add Vendor
        </Button>
      </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table className="w-full">
          <TableCaption className="caption-bottom text-sm text-gray-500 mt-4">
            A list of WordScape's vendors.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-gray-800">
              <TableHead className="font-semibold text-white text-left py-3 px-4">Name</TableHead>
              <TableHead className="font-semibold text-white text-left py-3 px-4">Address</TableHead>
              <TableHead className="font-semibold text-white text-left py-3 px-4">VAT</TableHead>
              <TableHead className="font-semibold text-white text-left py-3 px-4">Phone</TableHead>
              <TableHead className="font-semibold text-white text-left py-3 px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor._id} className="border-b border-gray-200 hover:bg-gray-50">
                <TableCell className="py-3 px-4">{vendor.vendorName}</TableCell>
                <TableCell className="py-3 px-4">{vendor.vendorAddress}</TableCell>
                <TableCell className="py-3 px-4">{vendor.vendorVAT}</TableCell>
                <TableCell className="py-3 px-4">{vendor.vendorPhone}</TableCell>
                <TableCell className="py-3 px-4">
                  <Button
                    variant="outline"
                    className="mr-2 text-gray-600 hover:text-white hover:bg-gray-600 transition-colors"
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
        </div>

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
              updateVendor={vendorService.updateVendor}
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
