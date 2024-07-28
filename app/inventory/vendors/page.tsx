"use client";

import React from "react";
import Vendors from "@/app/components/Vendors/Vendors";
import { AuthorizationWrapper } from "@/app/util/authContext"; // Import AuthorizationWrapper
import { useRouter } from "next/navigation"; // Import useRouter

const Page = () => {
  const router = useRouter();
  const pathname = router.asPath;

  return (
    <AuthorizationWrapper pathname={pathname}>
      {" "}
      <Vendors />
    </AuthorizationWrapper>
  );
};

export default Page;
