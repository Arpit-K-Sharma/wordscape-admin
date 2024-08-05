"use client";
import React from "react";
import { usePathname } from "next/navigation";
import BindingPage from "./_components/Binding"
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <BindingPage/>
    </AuthorizationWrapper>
  );
};

export default Page;






