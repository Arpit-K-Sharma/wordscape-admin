"use client";
import React from "react";
import { usePathname } from "next/navigation";
import CostCalculationPage from "./_components/CostCalculation";
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <CostCalculationPage/>
    </AuthorizationWrapper>
  );
};

export default Page;

