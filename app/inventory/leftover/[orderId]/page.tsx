"use client";
import LeftoversPage from "@/app/components/Leftover/Leftover";
import React from "react";

const page = ({ params }: { params: { orderId: string } }) => {
  return <LeftoversPage orderId={params.orderId} />;
};

export default page;