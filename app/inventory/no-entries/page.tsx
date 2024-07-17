"use client";
import PurchaseEntryList from "@/app/components/PurchaseNoEntry/PurchaseEntryList"
import React from "react";
import toast, {Toaster} from 'react-hot-toast'

const entries = () => {
  return <>
  <PurchaseEntryList />;
  <Toaster />
  </>
  
};

export default entries;
