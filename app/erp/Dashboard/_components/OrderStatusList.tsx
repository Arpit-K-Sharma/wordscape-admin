// components/OrderStatusList.tsx
"use client";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import {
  Order,
  TrackingData,
  TrackingStage,
} from "../../../Schema/erpSchema/dashboardSchema";
import { fetchTrackingData } from "../../../services/erpServices/dasboardService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderStatusListProps {
  orderDetails: Order[];
}

const OrderStatusList: React.FC<OrderStatusListProps> = ({ orderDetails }) => {
  const [trackingData, setTrackingData] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchAllTrackingData = async () => {
      const trackingResults = await Promise.all(
        orderDetails.map(async (order) => {
          try {
            const data = await fetchTrackingData(order.orderId);
            return [order.orderId, getLastCompletedStage(data)];
          } catch (error) {
            console.error(
              `Error fetching tracking data for order ${order.orderId}:`,
              error
            );
            return [order.orderId, "Error"];
          }
        })
      );
      setTrackingData(Object.fromEntries(trackingResults));
    };

    fetchAllTrackingData();
  }, [orderDetails]);

  const getLastCompletedStage = (data: TrackingData): string => {
    const stages: TrackingStage[] = [
      { key: "orderSlip", label: "Order Slip" },
      { key: "jobCard", label: "Job Card" },
      { key: "paperCutting", label: "Paper Cutting" },
      { key: "platePreparation", label: "Plate Preparation" },
      { key: "printing", label: "Printing" },
      { key: "postPress", label: "Post Press" },
      { key: "delivery", label: "Delivery" },
      { key: "invoice", label: "Invoice" },
      { key: "end", label: "End" },
    ];

    for (let i = stages.length - 1; i >= 0; i--) {
      if (data[stages[i].key]) {
        return stages[i].label;
      }
    }
    return "Not Started";
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Customer Name</TableHead>
            <TableHead className="w-1/2 text-center">Tracking Stage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderDetails.slice(0, 5).map((order) => (
            <TableRow key={order.orderId}>
              <TableCell className="flex items-center gap-2 text-center">
                <Avatar
                  name={order.customer || "N/A"}
                  size="32"
                  round={true}
                  color="#990aff"
                />
                <span className="truncate">{order.customer || "N/A"}</span>
              </TableCell>
              <TableCell className="text-center">
                <span>{trackingData[order.orderId] || "Loading..."}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderStatusList;
