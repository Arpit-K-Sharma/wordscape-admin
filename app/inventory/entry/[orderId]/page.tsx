"use client"
import { PurchaseEntrySlip } from "@/app/components/PurchaseEntryForm/PurchaseEntryForm";
import React from "react";

import { useSearchParams } from 'next/navigation';

const Page = ({ params }: { params: { orderId: string } }) => {
    const searchParams = useSearchParams();
    const reorder = searchParams.get('reorder');

    const props = {
        orderId: params.orderId,
        ...(reorder === 'True' && { isReorder: true }),
        ...(reorder !== 'True' && { isReorder: false })
    };

    return <PurchaseEntrySlip {...props} />;
};

export default Page;