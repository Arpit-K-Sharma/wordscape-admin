"use client";
import React from "react";
import { ReorderTable } from "@/app/components/Reorder/Reorder";
import { AuthorizationWrapper } from "@/app/util/authContext";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  return (
    <AuthorizationWrapper pathname={pathname}>
      <ReorderTable />
    </AuthorizationWrapper>
  );
};

export default Page;
