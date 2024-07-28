"use client";
import { PurchaseEntrySlip } from "@/app/components/PurchaseEntryForm/PurchaseEntryForm";
import React from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = ({ params }: { params: { orderId: string } }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const reorder = searchParams.get("reorder");

  const props = {
    orderId: params.orderId,
    ...(reorder === "True" && { isReorder: true }),
    ...(reorder !== "True" && { isReorder: false }),
  };

  return (
    <AuthorizationWrapper pathname={pathname}>
      <div>
        <PurchaseEntrySlip {...props} />
      </div>
      <Toaster
        toastOptions={{
          duration: 5000,
        }}
      />
    </AuthorizationWrapper>
  );
};

export default Page;
