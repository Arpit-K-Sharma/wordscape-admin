"use client";

import React from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import { AuthorizationWrapper } from "../util/authContext";
import { useRouter } from "next/navigation"; // Import useRouter

const InventoryPage = () => {
  const router = useRouter();
  const pathname = router.asPath;

  return (
    <AuthorizationWrapper pathname={pathname}>
      {" "}
      <Dashboard />
    </AuthorizationWrapper>
  );
};

export default InventoryPage;
