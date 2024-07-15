"use client";
import StocksPage from "@/app/components/Stock/Stock";
import React from "react";
import toast, { Toaster } from 'react-hot-toast';

const page = () => {
  return <>
    <StocksPage />;
    <Toaster />
  </>

};

export default page;
