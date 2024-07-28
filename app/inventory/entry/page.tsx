import { PurchaseEntrySlip } from "@/app/components/PurchaseEntryForm/PurchaseEntryForm";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthorizationWrapper } from "@/app/util/authContext";

const page = ({ params }: { params: { orderId: string } }) => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <PurchaseEntrySlip orderId={params.orderId} />
    </AuthorizationWrapper>
  );
};

export default page;
