"use client";

import React from "react";
import Leftover from "@/app/components/Leftover/Leftovers";
import { AuthorizationWrapper } from "@/app/util/authContext";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname(); // Call usePathname directly

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Leftover />
    </AuthorizationWrapper>
  );
};

export default Page;
