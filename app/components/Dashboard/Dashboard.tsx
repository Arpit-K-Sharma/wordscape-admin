"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Printer,
  Package,
  ClipboardList,
  Settings,
  Truck,
} from "lucide-react";
import InventorySidebar from "../Sidebar/InventorySidebar";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ApprovedOrders {
  _id: string;
  date: string;
  customer: string;
  estimatedAmount: string;

}

const Dashboard = () => {
  const [approvedOrders, setApprovedOrders] = useState<ApprovedOrders[]>([]);
  useEffect(() => {
    const fetch_approved_orders = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/get/approved_orders"
        );
        setApprovedOrders(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    fetch_approved_orders();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
      <InventorySidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Inventory Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paper Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,750 sheets</div>
              <p className="text-xs text-muted-foreground">
                3 types low on stock
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lamination in Stock
              </CardTitle>
              <Printer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13</div>
              <p className="text-xs text-muted-foreground">
                Enough Lamination for Order ID
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Orders Accepted
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                2 pending approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <Table className="w-full text-sm text-left rtl:text-right text-white">
                <TableHeader className="text-xs text-black uppercase bg-gray-100 shadow-md">
                  <TableRow>
                    <TableHead className="py-[30px] flex items-center">
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      Order Id
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      Date
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      Customer Id
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      Estimated Cost
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      View Details
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      Create Order
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {approvedOrders.map((order, index) => (
                      <TableRow
                        key={order._id ?? index}
                        className="bg-white border-b font-medium text-[17px] hover:bg-gray-200 text-black"
                      >
                        <TableCell className="w-4 p-4 text-[17px]"></TableCell>
                        <TableCell className="px-6 font-medium text-[17px] whitespace-nowrap text-black py-[20px]">
                          {order._id || order._id === '0' ? order._id : "N/A"}
                        </TableCell>
                        <TableCell className="px-6 py-[20px]">{order.date}</TableCell>
                        <TableCell className="px-6 py-[20px]">{order.customer}</TableCell>
                        <TableCell className="px-6 py-[20px]">
                          Rs.{order.estimatedAmount}
                        </TableCell>
                        <TableCell className="px-6 py-[20px]">
                          <button className="bg-orange-400 p-[10px] rounded-[10px] text-white font-semibold tracking-wide cursor-pointer">
                            Order Details
                          </button>
                        </TableCell>
                        <TableCell className="px-6 py-[20px]">
                          <button className="bg-orange-400 p-[10px] rounded-[10px] text-white font-semibold tracking-wide cursor-pointer">
                            Request Order
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
