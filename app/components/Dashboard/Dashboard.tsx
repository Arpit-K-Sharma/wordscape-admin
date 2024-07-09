"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


interface ApprovedOrders {
  _id: string;
  date: string;
  customer: string;
  estimatedAmount: string;
  deadline: string;
  paperSize: string;
  pages: string;
  quantity: string;
  binding: string;
  coverTreatment: string;
  innerPaper: string;
  innerPaperThickness: string;
  outerPaper: string;
  outerPaperThickness: string;
  innerLamination: string;
  outerLamination: string;
  inkType: string;
  deliveryOption: string;
  status: string;

}

interface User {
  fullName: string;
}

const Dashboard = () => {
  const [approvedOrders, setApprovedOrders] = useState<ApprovedOrders[]>([]);
  const [user, setUser] = useState<User[]>([])
  useEffect(() => {
    const fetch_approved_orders = async () => {
      try {
        const orders = await axios.get(
          "http://127.0.0.1:8000/get/approved_orders"
        );
        setApprovedOrders(orders.data.data);
        console.log(orders.data.data);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    fetch_approved_orders();
  }, []);

  useEffect(() => {
    const fetch_user = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get/user/${approvedOrders[0].customer}`
        );
        setUser([response.data.data]);
        console.log(response.data);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    fetch_user();
  }, [approvedOrders]);

  const router = useRouter();
  const handleRequestPO = (orderId: string) => {
    router.push(`/inventory/entry/${orderId}`);
  };

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
                      Customer Name
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      Estd. Cost
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      View Details
                    </TableHead>
                    <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                      Action
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
                      <TableCell className="px-6 py-[20px]">{user.length > 0 && (
                        <p>{user[0].fullName}</p>
                      )}</TableCell>
                      <TableCell className="px-6 py-[20px]">
                        Rs.{order.estimatedAmount}
                      </TableCell>
                      <TableCell className="px-6 py-[20px]">
                        <Sheet>
                          <SheetTrigger><Button className="px-[15px] font-semibold" type="button">Order Details</Button></SheetTrigger>
                          <SheetContent className="w-[800px]">
                            <SheetHeader>
                              <SheetTitle className="font-bold text-[20px] text-center mb-[10px]">Order Details</SheetTitle>
                              <SheetDescription className="font-bold text-[15px]">
                                <Table>
                                  <TableRow>
                                    <TableHead>Order Id</TableHead>
                                    <TableHead>{order._id}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Customer Name</TableHead>
                                    <TableHead>
                                      {user.length > 0 && (
                                        <p>{user[0].fullName}</p>
                                      )}
                                    </TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>{order.date}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Paper Size</TableHead>
                                    <TableHead>{order.paperSize}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Pages</TableHead>
                                    <TableHead>{order.pages}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>{order.quantity}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Binding</TableHead>
                                    <TableHead>{order.binding}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Cover Treatment</TableHead>
                                    <TableHead>{order.coverTreatment}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Inner Paper</TableHead>
                                    <TableHead>{order.innerPaper}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Outer Paper</TableHead>
                                    <TableHead>{order.outerPaper}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Ink Type</TableHead>
                                    <TableHead>{order.inkType}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Delivery Option</TableHead>
                                    <TableHead>{order.deliveryOption}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>{order.status}</TableHead>
                                  </TableRow>
                                </Table>
                              </SheetDescription>
                            </SheetHeader>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                      <TableCell className="px-6 py-[20px]">
                        <Button
                          className="px-[15px] font-semibold"
                          type="button"
                          onClick={() => handleRequestPO(order._id)}>
                          Request PO
                        </Button>
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
