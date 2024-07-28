"use client";

import PurchaseWithEntry from "@/app/components/PurchaseItemEntry/PurchaseWithEntry";
import { AuthorizationWrapper } from "@/app/util/authContext";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const pathname = router.asPath;

  return (
    <AuthorizationWrapper pathname={pathname}>
      {" "}
      {/* Pass pathname prop */}
      <PurchaseWithEntry />
    </AuthorizationWrapper>
  );
};

export default Page;
