"use client";
import React from "react";
import { usePathname } from "next/navigation";
import LaminationPage from "./_components/lamination"
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <LaminationPage/>
    </AuthorizationWrapper>
  );
};

export default Page;








