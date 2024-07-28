"use client";

import StocksPage from "@/app/components/Stock/Stock";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthorizationWrapper } from "@/app/util/authContext"; // Adjust the import path as necessary
import { usePathname } from "next/navigation";

const page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <>
        <StocksPage />
        <Toaster />
      </>
    </AuthorizationWrapper>
  );
};

export default page;
