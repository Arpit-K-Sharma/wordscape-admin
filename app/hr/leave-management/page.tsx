"use client";
import React from "react";
import { AuthorizationWrapper } from "@/app/util/authContext";
import Leaves from "./_components/Leaves";

const page = () => {
  return (
    <AuthorizationWrapper>
      <Leaves />
    </AuthorizationWrapper>
  );
};

export default page;
