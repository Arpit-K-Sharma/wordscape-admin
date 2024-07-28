import React from "react";
import Payroll from "./_components/Payroll";
import { AuthorizationWrapper } from "@/app/util/authContext";

const page = () => {
  return (
    <AuthorizationWrapper>
      <Payroll />
    </AuthorizationWrapper>
  );
};

export default page;
