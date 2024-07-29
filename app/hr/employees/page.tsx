"use client";
import React from "react";
import EmployeesPage from "./_components/Employees";
import { AuthorizationWrapper } from "@/app/util/authContext";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <EmployeesPage />
    </AuthorizationWrapper>
  );
};

export default Page;
