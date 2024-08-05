"use client"
import React from "react";
import { usePathname } from "next/navigation";
import PaperSizeComponent from "./_components/PaperSize"
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <PaperSizeComponent/>
    </AuthorizationWrapper>
  );
};

export default Page;








