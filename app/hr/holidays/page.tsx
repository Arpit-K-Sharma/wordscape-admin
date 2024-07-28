"use client";
import React from "react";
import HolidaysPage from "./_components/Holidays";
import { AuthorizationWrapper } from "@/app/util/authContext";
const page = () => {
  return (
    <AuthorizationWrapper>
      <HolidaysPage />
    </AuthorizationWrapper>
  );
};

export default page;
