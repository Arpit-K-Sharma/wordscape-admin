import { PurchaseEntrySlip } from "@/app/components/PurchaseEntryForm/PurchaseEntryForm";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

const page = ({ params }: { params: { orderId: string } }) => {
  return <PurchaseEntrySlip orderId={params.orderId} />;
};

export default page;
