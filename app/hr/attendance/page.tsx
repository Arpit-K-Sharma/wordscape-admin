import React from "react";
import AttendanceForm from "./_components/attendance";
import { AuthorizationWrapper } from "@/app/util/authContext";

const page = () => {
  return (
    <AuthorizationWrapper>
      <AttendanceForm />
    </AuthorizationWrapper>
  );
};

export default page;
