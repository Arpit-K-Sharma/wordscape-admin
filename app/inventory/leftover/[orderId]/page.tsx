"use client";

import React from "react";
import LeftoversPage from "@/app/components/Leftover/Leftover";
import { Toaster } from "react-hot-toast";
import { AuthorizationWrapper } from "@/app/util/authContext";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: { orderId: string } }) => {
  const router = useRouter();
  const pathname = router.asPath;

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
