"use client";

import React from "react";
import HROverview from "@/app/components/HRDashboard/HRDashboard";
import { AuthorizationWrapper } from "../util/authContext";
import { usePathname } from "next/navigation";

const HRPage = () => {
  const pathname = usePathname();
  return (
    <AuthorizationWrapper pathname={pathname}>
      <HROverview />
    </AuthorizationWrapper>
  );
};

export default HRPage;
