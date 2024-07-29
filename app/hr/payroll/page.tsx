"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuthorizationWrapper } from "@/app/util/authContext";
import Payrolls from "./_components/Payroll";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Payrolls />
    </AuthorizationWrapper>
  );
};

export default Page;
