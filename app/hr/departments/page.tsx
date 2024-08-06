"use client";
import React from "react";
import { AuthorizationWrapper } from "@/app/util/authContext";
import Departments from "./_components/Departments";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Departments />
    </AuthorizationWrapper>
  );
};

export default Page;
