"use client";
import React from "react";
import { usePathname } from "next/navigation";
import JobCardPage from "../_components/jobcard";
import { AuthorizationWrapper } from "@/app/util/authContext";

const Page = ({ params }: { params: { orderId: string } }) => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      <JobCardPage ordersId={params.orderId} />
    </AuthorizationWrapper>
  );
};

export default Page;
