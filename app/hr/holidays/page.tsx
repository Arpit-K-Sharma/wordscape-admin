"use client";
import React from "react";
import { AuthorizationWrapper } from "@/app/util/authContext";
import { usePathname } from "next/navigation";
import HolidaysPage from "./_components/Holidays";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <HolidaysPage />
    </AuthorizationWrapper>
  );
};

export default Page;
