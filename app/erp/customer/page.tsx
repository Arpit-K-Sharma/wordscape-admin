"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Customers from "./_customer/customer"
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Customers/>
    </AuthorizationWrapper>
  );
};

export default Page;




