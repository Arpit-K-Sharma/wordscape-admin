"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuthorizationWrapper } from "@/app/util/authContext";
import Leaves from "./_components/Leaves";

const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Leaves />
    </AuthorizationWrapper>
  );
};

export default Page;
