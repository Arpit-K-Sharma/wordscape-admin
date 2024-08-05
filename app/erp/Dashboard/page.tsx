"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AdminDashboard from './_components/Dashboard'
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <AdminDashboard />
    </AuthorizationWrapper>
  );
};

export default Page;





