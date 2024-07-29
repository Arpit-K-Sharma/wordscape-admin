"use client";

import React from "react";
import LeftoversPage from "@/app/components/Leftover/Leftover";
import { Toaster } from "react-hot-toast";
import { AuthorizationWrapper } from "@/app/util/authContext";
import { usePathname } from "next/navigation";

const Page = ({ params }: { params: { orderId: string } }) => {
  const pathname = usePathname();

  return (
    <AuthorizationWrapper pathname={pathname}>
      {" "}
      {/* Pass pathname prop */}
      <LeftoversPage orderId={params.orderId} />
      <Toaster />
    </AuthorizationWrapper>
  );
};

export default Page;
