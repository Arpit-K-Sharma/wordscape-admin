"use client"
import React from "react";
import { usePathname } from "next/navigation";
import PlatesPage from "./_components/Plates";
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <PlatesPage/>
    </AuthorizationWrapper>
  );
};

export default Page;








