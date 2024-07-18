"use client";
import PurchaseEntryList from "@/app/components/PurchaseNoEntry/PurchaseWithoutEntry"
import React from "react";
import toast, {Toaster} from 'react-hot-toast'

const entries = () => {
  return <>
  <PurchaseEntryList />;
  <Toaster />
  </>
  
};

export default entries;
