"use client";

import React from "react";
import Vendors from "@/app/components/Vendors/Vendors";
import { AuthorizationWrapper } from "@/app/util/authContext"; // Import AuthorizationWrapper
import { usePathname } from "next/navigation";
const Page = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      {" "}
      <Vendors />
    </AuthorizationWrapper>
  );
};

export default Page;
