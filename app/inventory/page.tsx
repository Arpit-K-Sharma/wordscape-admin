"use client";

import React from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import { AuthorizationWrapper } from "../util/authContext";
import { usePathname } from "next/navigation";

const InventoryPage = () => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      {" "}
      <Dashboard />
    </AuthorizationWrapper>
  );
};

export default InventoryPage;
