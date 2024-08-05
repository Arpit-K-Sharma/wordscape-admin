"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Users from "./_components/user"
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Users/>
    </AuthorizationWrapper>
  );
};

export default Page;










