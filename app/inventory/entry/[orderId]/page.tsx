import { PurchaseEntrySlip } from "@/app/components/PurchaseEntryForm/PurchaseEntryForm";
import React from "react";

const page = ({ params }: { params: { orderId: string } }) => {
  return <PurchaseEntrySlip orderId={params.orderId} />;
};

export default page;
