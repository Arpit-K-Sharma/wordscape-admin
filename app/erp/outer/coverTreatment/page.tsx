"use client";
import React from "react";
import { usePathname } from "next/navigation";
import CoverTreatmentPage from "./_components/CoverTreatment"
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <CoverTreatmentPage/>
    </AuthorizationWrapper>
  );
};

export default Page;






