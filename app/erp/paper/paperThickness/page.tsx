"use client"
import React from "react";
import { usePathname } from "next/navigation";
import PaperThicknessPage from "./_components/paperThickness"
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <PaperThicknessPage/>
    </AuthorizationWrapper>
  );
};

export default Page;








