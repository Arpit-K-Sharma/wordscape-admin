"use client";

import PurchaseWithEntry from "@/app/components/PurchaseItemEntry/PurchaseWithEntry";
import { AuthorizationWrapper } from "@/app/util/authContext";
import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <PurchaseWithEntry />
    </AuthorizationWrapper>
  );
};

export default Page;
