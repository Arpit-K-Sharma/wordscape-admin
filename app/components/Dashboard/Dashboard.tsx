"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight } from 'lucide-react';
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Cover,
  dashboardService,
} from "@/app/services/inventoryServices/dashboardService";

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

interface CoverTreatment {
  coverTreatmentType: string;
}

interface Paper {
  paperType: string;
}

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

interface CoverTreatment {
  coverTreatmentType: string;
}

interface Paper {
  paperType: string;
}

type POStatus = 'not_requested' | 'requested' | 'created';

const Dashboard = () => {
  const [approvedOrders, setApprovedOrders] = useState<ApprovedOrders[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [coverTreatment, setCoverTreatment] = useState<CoverTreatment | null>(
    null
  );
  const [innerPaper, setInnerPaper] = useState<Paper | null>(null);
  const [outerPaper, setOuterPaper] = useState<Paper | null>(null);
  const [poRequested, setPoRequested] = useState<{ [key: string]: boolean }>({});

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetch_approved_orders = async () => {
      try {
        const orders = await dashboardService.fetch_approved_orders();
        setApprovedOrders(orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetch_approved_orders();
  }, []);

  useEffect(() => {
    const fetch_user = async () => {
      try {
        const user = await dashboardService.fetch_user(
          approvedOrders[0]?.customer
        );
        setUser(user);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    const fetch_cover_treatment = async () => {
      try {
        const coverTreatment = await dashboardService.fetch_cover_treatment(
          approvedOrders[0]?.coverTreatment
        );
        console.log(approvedOrders[0]?.coverTreatment);
        setCoverTreatment(coverTreatment);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    const fetch_inner_paper = async () => {
      try {
        const innerPaper = await dashboardService.fetch_paper(
          approvedOrders[0]?.innerPaper
        );
        console.log(approvedOrders[0]?.innerPaper);
        setInnerPaper(innerPaper);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    const fetch_outer_paper = async () => {
      try {
        const outerPaper = await dashboardService.fetch_paper(
          approvedOrders[0]?.outerPaper
        );
        setOuterPaper(outerPaper);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    fetch_user();
    fetch_cover_treatment();
    fetch_inner_paper();
    fetch_outer_paper();
  }, [approvedOrders]);


  const [poStatus, setPoStatus] = useState<Record<string, POStatus>>({});
  const router = useRouter();

  useEffect(() => {
    const storedPoStatus = localStorage.getItem('poStatus');
    if (storedPoStatus) {
      setPoStatus(JSON.parse(storedPoStatus));
    }
  }, []);

  const handleRequestPO = (orderId: string) => {
    router.push(`/inventory/entry/${orderId}`);
  };

  const handlePOSubmit = (orderId: string) => {
    const newStatus: Record<string, POStatus> = { ...poStatus, [orderId]: 'created' };
    setPoStatus(newStatus);

    // Store the updated state in localStorage
    localStorage.setItem('poStatus', JSON.stringify(newStatus));

    // Additional logic for PO submission
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-100 font-archivo">
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
    fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    sm:relative sm:translate-x-0 transition duration-200 ease-in-out
    w-64 bg-white shadow-lg z-40 sm:z-0 max-lg:h-screen
  `}>
        <InventorySidebar />
      </div>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <h1 className="text-3xl sm:text-3xl max-sm:ml-[50px] font-bold mb-4 sm:mb-6">Inventory Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
              <div className="text-2xl font-bold">{approvedOrders.length}</div>
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
                    <TableHead className="py-[30px] flex items-center"></TableHead>
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
                        {order._id || order._id === "0" ? order._id : "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-[20px]">
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-[20px]">
                        {user?.fullName}
                      </TableCell>
                      <TableCell className="px-6 py-[20px]">
                        Rs.{order.estimatedAmount}
                      </TableCell>
                      <TableCell className="px-6 py-[20px]">
                        <Sheet>
                          <SheetTrigger>
                            <Button
                              className="px-[15px] font-semibold bg-[#6A9BD1] hover:bg-[#172447]"
                              type="button"
                            >
                              Order Details
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[800px]">
                            <SheetHeader>
                              <SheetTitle className="font-bold text-[20px] text-center mb-[10px]">
                                Order Details
                              </SheetTitle>
                              <SheetDescription className="font-bold text-[15px] shadow-sm border-black p-[10px] rounded-md">
                                <Table>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold text-gray-600">
                                      Order Id
                                    </TableHead>
                                    <TableHead>{order._id}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Customer Name
                                    </TableHead>
                                    <TableHead>
                                      <p>{user?.fullName}</p>
                                    </TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Date
                                    </TableHead>
                                    <TableHead>{order.date}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Paper Size
                                    </TableHead>
                                    <TableHead>{order.paperSize}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Pages
                                    </TableHead>
                                    <TableHead>{order.pages}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Quantity
                                    </TableHead>
                                    <TableHead>{order.quantity}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Binding
                                    </TableHead>
                                    <TableHead>{order.binding}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Cover Treatment
                                    </TableHead>
                                    <TableHead>
                                      {coverTreatment?.coverTreatmentType}
                                    </TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Inner Paper
                                    </TableHead>
                                    <TableHead>
                                      {innerPaper?.paperType}
                                    </TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Outer Paper
                                    </TableHead>
                                    <TableHead>
                                      {outerPaper?.paperType}
                                    </TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Ink Type
                                    </TableHead>
                                    <TableHead>{order.inkType}</TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold  text-gray-600">
                                      Delivery Option
                                    </TableHead>
                                    <TableHead>
                                      {order.deliveryOption}
                                    </TableHead>
                                  </TableRow>
                                  <TableRow>
                                    <TableHead className="p-[10px] font-semibold text-gray-600">
                                      Status
                                    </TableHead>
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
                          className="px-[15px] font-semibold bg-[#36454F] hover:bg-[#172447]"
                          type="button"
                          onClick={() => handleRequestPO(order._id)}
                          disabled={poStatus[order._id] === 'created'}
                        >
                          {poStatus[order._id] === 'created' ? 'PO Created' : 'Request PO'}
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
