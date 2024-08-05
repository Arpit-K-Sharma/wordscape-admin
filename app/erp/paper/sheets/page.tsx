"use client"
import React from "react";
import { usePathname } from "next/navigation";
import SheetsPage from "./_components/Sheets"
import { AuthorizationWrapper } from "@/app/util/authContext";

const page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <SheetsPage/>
    </AuthorizationWrapper>
  );
};

export default page;









