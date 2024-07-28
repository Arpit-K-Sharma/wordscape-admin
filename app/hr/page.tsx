"use client";

import React from "react";
import HROverview from "@/app/components/HRDashboard/HRDashboard";
import { AuthorizationWrapper } from "../util/authContext";

const HRPage = () => {
  return (
    <AuthorizationWrapper>
      <HROverview />
    </AuthorizationWrapper>
  );
};

export default HRPage;
