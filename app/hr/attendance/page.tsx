"use client";
import React from "react";
import { usePathname } from "next/navigation";
import AttendanceForm from "./_components/attendance";
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <AttendanceForm />
    </AuthorizationWrapper>
  );
};

export default Page;
