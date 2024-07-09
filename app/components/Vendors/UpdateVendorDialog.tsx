import React from "react";
import VendorForm from "./VendorForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiX } from "react-icons/fi";
import { vendorService } from "../Services/vendorsService";

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
  onVendorUpdated: () => void;
}

function UpdateVendorDialog({
  isOpen,
  closeModal,
  vendor,
  onVendorUpdated,
}: UpdateVendorDialogProps) {
  const onSubmit = async (data: Omit<Vendor, "_id">) => {
    try {
      await vendorService.updateVendor(vendor._id, data);
      onVendorUpdated();
      closeModal();
    } catch (error) {
      console.error("Error updating vendor:", error);
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
          buttonText={
            <span className="flex items-center justify-center">
              <FiEdit2 className="mr-2" />
              Update Vendor
            </span>
          }
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
