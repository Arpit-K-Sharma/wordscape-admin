"use client";

import React from "react";
import AttendanceHistory from "@/app/hr/attendance_history/_components/attendanceHistory";
import { usePathname } from "next/navigation";
import { AuthorizationWrapper } from "@/app/util/authContext";

interface PageProps {
  params: { staffId: string };
}

const AttendancePage = ({ params }: PageProps) => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <AttendanceHistory staffId={params.staffId} />
    </AuthorizationWrapper>
  );
};

export default AttendancePage;
