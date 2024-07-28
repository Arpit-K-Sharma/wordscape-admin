"use client";
import React from "react";
import { ReorderTable } from "@/app/components/Reorder/Reorder";
import { AuthorizationWrapper } from "@/app/util/authContext";

const page = () => {
  return (
    <AuthorizationWrapper>
      <ReorderTable />
    </AuthorizationWrapper>
  );
};

export default page;
