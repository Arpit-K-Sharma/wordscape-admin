"use client";
import React from "react";
import LeaveHistory from "@/app/hr/leave_history/_components/leaveHistory";
import { AuthorizationWrapper } from "@/app/util/authContext"; // Adjust the import path as necessary
import { usePathname } from "next/navigation";

interface PageProps {
  params: { staffId: string };
}

const LeavePage = ({ params }: PageProps) => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <LeaveHistory staffId={params.staffId} />
    </AuthorizationWrapper>
  );
};

export default LeavePage;
