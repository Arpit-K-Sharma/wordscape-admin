'use client'

import React, { useEffect, useState } from "react";
import axios from "../../../services/erpServices/axiosInstance";
import { IoMdTimer } from "react-icons/io";
import { SlSizeActual } from "react-icons/sl";
import { SiPowerpages } from "react-icons/si";
import { RiNumbersFill } from "react-icons/ri";
import { FaBook, FaCut, FaPaintBrush, FaLayerGroup, FaPrint, FaTint, FaComment, FaUser } from "react-icons/fa";
import { TbFileOrientation } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface OrderDetails {
  date: string;
  paperSize: string;
  orientation: string;
  pages: number;
  quantity: number;
  bindingType: string;
  coverTreatmentType: string;
  innerPaperType: string;
  innerPaperThickness: string;
  outerPaperType: string;
  outerPaperThickness: string;
  innerLamination: string;
  outerLamination: string;
  inkType: string;
  remarks: string;
  customer: string;
}

interface JobcardMenuProps {
  orderId: string;
  customerName: string;
}

export default function JobcardMenu({ orderId }: JobcardMenuProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const orderDetailsArray = orderDetails
    ? [
        { icon: IoMdTimer, label: "Date", value: new Date(orderDetails.date).toLocaleDateString() },
        { icon: SlSizeActual, label: "Paper Size", value: orderDetails.paperSize },
        { icon: TbFileOrientation, label: "Paper Orientation", value: orderDetails.orientation },
        { icon: SiPowerpages, label: "Pages", value: orderDetails.pages },
        { icon: RiNumbersFill, label: "Quantity", value: orderDetails.quantity },
        { icon: FaBook, label: "Binding Type", value: orderDetails.bindingType },
        { icon: FaCut, label: "Cover Treatment Type", value: orderDetails.coverTreatmentType },
        { icon: FaPaintBrush, label: "Inner Paper Type", value: orderDetails.innerPaperType },
        { icon: FaLayerGroup, label: "Inner Paper Thickness", value: orderDetails.innerPaperThickness },
        { icon: FaPaintBrush, label: "Outer Paper Type", value: orderDetails.outerPaperType },
        { icon: FaLayerGroup, label: "Outer Paper Thickness", value: orderDetails.outerPaperThickness },
        { icon: FaPrint, label: "Inner Lamination Type", value: orderDetails.innerLamination },
        { icon: FaPrint, label: "Outer Lamination Type", value: orderDetails.outerLamination },
        { icon: FaTint, label: "Ink Type", value: orderDetails.inkType },
        { icon: FaComment, label: "Remarks", value: orderDetails.remarks || "N/A" },
        { icon: FaUser, label: "Customer Name", value: orderDetails.customer },
      ]
    : [];

  return (
    <div className="flex items-center justify-between mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">Order Details</Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[90vw] max-w-[800px]">
          <h1 className="text-3xl mb-6 text-center">All Details</h1>
          {orderDetails ? (
            <div className="bg-secondary p-4 rounded-lg">
              <Table>
                <TableBody>
                  {orderDetailsArray.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell className="flex items-center gap-2">
                        <detail.icon className="text-primary" size={20} />
                        {detail.label}
                      </TableCell>
                      <TableCell>{detail.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}