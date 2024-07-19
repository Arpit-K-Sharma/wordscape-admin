"use client";
import LeftoversPage from "@/app/components/Leftover/Leftover";
import React from "react";
import { Toaster } from "react-hot-toast";

const page = ({ params }: { params: { orderId: string } }) => {
  return <>
  <LeftoversPage orderId={params.orderId} />
  <Toaster/>
  </>
};

export default page;