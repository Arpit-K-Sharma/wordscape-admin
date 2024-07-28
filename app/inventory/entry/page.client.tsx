"use client";

import { PurchaseEntrySlip } from "@/app/components/PurchaseEntryForm/PurchaseEntryForm";
import React from "react";
import { usePathname } from "next/navigation";
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = ({ params }: { params: { orderId: string } }) => {
  const pathname = usePathname();
  return (
    <AuthorizationWrapper pathname={pathname}>
      <PurchaseEntrySlip orderId={params.orderId} />
    </AuthorizationWrapper>
  );
};

export default Page;
