import React, { useState } from "react";
import axios from "axios";
import VendorForm from "./VendorForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";

interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

interface UpdateVendorDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  vendor: Vendor;
}

function UpdateVendorDialog({
  isOpen,
  closeModal,
  vendor,
}: UpdateVendorDialogProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);

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

  const onSubmit = async (data: Omit<Vendor, "_id">) => {
    console.log("vendor: " + JSON.stringify(vendor));
    const url = `http://localhost:8000/vendor/${vendor._id}`;
    try {
      const response = await axios.put<{ status: string; data: Vendor }>(
        url,
        data
      );
      if (response.data.status === "success") {
        console.log("Vendor updated", response.data.data);
        closeModal();
        fetchVendors();
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error occurred while updating the vendor:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Vendor</DialogTitle>
        </DialogHeader>
        <VendorForm
          onSubmit={onSubmit}
          defaultValues={{ ...vendor, id: vendor._id }}
          buttonText={(
            <span className="flex items-center justify-center">
              <FiEdit2 className="mr-2" />
              Update Vendor
            </span>
          )}
        />
        <Button
          variant="destructive"
          onClick={closeModal}
          className="mt-4 w-full bg-red-600"
        >
          <FiX className="mr-2" />
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateVendorDialog;
