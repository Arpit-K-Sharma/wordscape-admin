"use client";

import { AuthorizationWrapper } from "@/app/util/authContext";
import React from "react";
import { useRouter } from "next/navigation";
import PurchaseEntryList from "@/app/components/PurchaseNoEntry/PurchaseWithoutEntry";

const Page = () => {
  const router = useRouter();
  const pathname = router.asPath;

  return (
    <AuthorizationWrapper pathname={pathname}>
      {" "}
      {/* Pass pathname prop */}
      <PurchaseEntryList />
    </AuthorizationWrapper>
  );
};

export default Page;
