import React from "react";
import EmployeesPage from "./_components/Employees";
import { AuthorizationWrapper } from "@/app/util/authContext";

const page = () => {
  return (
    <AuthorizationWrapper>
      <EmployeesPage />
    </AuthorizationWrapper>
  );
};

export default page;
