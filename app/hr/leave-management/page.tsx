"use client";
import React from "react";
import Leaves from "./_components/Leaves";
import { AuthorizationWrapper } from "@/app/util/authContext";

const page = () => {
  return (
    <AuthorizationWrapper>
      <Leaves />
    </AuthorizationWrapper>
  );
};

export default page;
