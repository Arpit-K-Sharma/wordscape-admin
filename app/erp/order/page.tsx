"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Orders from "./_components/order"
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Orders/>
    </AuthorizationWrapper>
  );
};

export default Page;





