"use client";

import { AuthorizationWrapper } from "@/app/util/authContext";
import React from "react";
import PurchaseEntryList from "@/app/components/PurchaseNoEntry/PurchaseWithoutEntry";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      {" "}
      {/* Pass pathname prop */}
      <PurchaseEntryList />
    </AuthorizationWrapper>
  );
};

export default Page;
