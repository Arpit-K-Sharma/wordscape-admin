"use client"
import React from "react";
import { usePathname } from "next/navigation";
import Paper from "./_components/Paper"
import { AuthorizationWrapper } from "@/app/util/authContext";

const page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Paper/>
    </AuthorizationWrapper>
  );
};

export default page;








