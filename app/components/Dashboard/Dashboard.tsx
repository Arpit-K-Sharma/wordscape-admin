"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, X, Package, Printer, ClipboardList, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { dashboardService } from "@/app/services/inventoryServices/dashboardService";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion, AnimatePresence } from "framer-motion";
import {
  ApprovedOrders,
  User,
  Cover,
  Paper,
  InventoryItem,
} from "../../Schema/dashboardSchema";

const Dashboard = () => {
  const [approvedOrders, setApprovedOrders] = useState<ApprovedOrders[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [poCreated, setPoCreated] = useState(0);
  const [poPending, setPoPending] = useState(0);
  const [innerPaper, setInnerPaper] = useState<Paper | null>(null);
  const [outerPaper, setOuterPaper] = useState<Paper | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [poStatus, setPoStatus] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      try {
        const orders = await dashboardService.fetch_approved_orders();
        const poCreatedOrders = orders.filter(
          (order) => order.purchase_order_created === true
        );
        setPoCreated(poCreatedOrders.length);
        const poCreatedNotOrders = orders.filter(
          (order) => order.purchase_order_created === null
        );
        setPoPending(poCreatedNotOrders.length);
        setApprovedOrders(orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchApprovedOrders();
  }, []);

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (approvedOrders.length > 0) {
        try {
          const user = await dashboardService.fetch_user(
            approvedOrders[0].customer
          );
          setUser(user);

          const innerPaper = await dashboardService.fetch_paper(
            approvedOrders[0].innerPaper
          );
          setInnerPaper(innerPaper);

          const outerPaper = await dashboardService.fetch_paper(
            approvedOrders[0].outerPaper
          );
          setOuterPaper(outerPaper);
        } catch (error) {
          console.error("Error fetching related data:", error);
        }
      }
    };

    fetchRelatedData();
  }, [approvedOrders]);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const items = await dashboardService.fetch_inventory_items();
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchInventoryData();
  });

  const handleRequestPO = (orderId: string) => {
    router.push(`/inventory/entry/${orderId}`);
  };
  return (
    <div className="flex min-h-screen bg-gray-100 font-archivo">
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`
      fixed inset-y-0 left-0 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }
      sm:relative sm:translate-x-0 transition duration-200 ease-in-out
      w-64 bg-white shadow-lg z-40 sm:z-0 max-lg:h-screen
    `}
      >
        <InventorySidebar />
      </div>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="flex">
          <h1 className="text-3xl sm:text-3xl max-sm:ml-[50px] font-bold mb-4 sm:mb-6">
            Inventory Overview
          </h1>
          <div className="mt-[-25px] ml-[10px]">
            <span className="text-2xl font-normal text-gray-600 ml-2">
              <HoverCard>
                <HoverCardTrigger>
                  <Info className="hover:cursor-pointer hover:text-blue-900" />
                </HoverCardTrigger>
                <HoverCardContent className="w-[300px] rounded-[20px]">
                  <div className="p-[10px] items-center justify-center font-archivo">
                    <h1 className="ml-[20px] font-semibold mb-[10px] text-[15px] text-gray-700">
                      Information
                    </h1>
                    <p className=" ml-[20px] text-left text-gray-600 text-[15px]">
                      Welcome to the Inventory Dashboard! This page provides an
                      overview of your inventory, and you can create purchase
                      orders from here.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Item
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {inventoryItems &&
                  inventoryItems.length > 0 &&
                  inventoryItems[currentIndex] && (
                    <motion.div
                      key={inventoryItems[currentIndex].item[0].itemName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-2xl font-bold">
                        {inventoryItems[currentIndex].item[0].itemName}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Type: {inventoryItems[currentIndex].type} |
                        Availability:{" "}
                        {inventoryItems[currentIndex].item[0].availability}
                      </p>
                    </motion.div>
                  )}
              </AnimatePresence>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Orders Being Processed / Completed
              </CardTitle>
              <Printer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{poCreated}</div>
              <p className="text-xs text-muted-foreground">
                {poCreated} PO created
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
              <div className="text-2xl font-bold">{poPending}</div>
              <p className="text-xs text-muted-foreground">
                {poPending} pending approval
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex flex-row justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <div>
                <Select onValueChange={(value) => setPoStatus(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="PO Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requested">Pending PO</SelectItem>
                    <SelectItem value="created">Created PO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                  {poStatus === "created"
                    ? approvedOrders &&
                      approvedOrders
                        .filter(
                          (order) => order.purchase_order_created === true
                        )
                        .map((order, index) => (
                          <TableRow
                            key={order._id ?? index}
                            className="bg-white border-b font-medium text-[17px] hover:bg-gray-200 text-black"
                          >
                            <TableCell className="w-4 p-4 text-[17px]"></TableCell>
                            <TableCell className="px-6 font-medium text-[17px] whitespace-nowrap text-black py-[20px]">
                              {order._id || order._id === "0"
                                ? order._id
                                : "N/A"}
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
                                          <TableHead>
                                            {order.paperSize}
                                          </TableHead>
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
                                          <TableHead>
                                            {order.quantity}
                                          </TableHead>
                                        </TableRow>
                                        <TableRow>
                                          <TableHead className="p-[10px] font-semibold  text-gray-600">
                                            Binding
                                          </TableHead>
                                          <TableHead>{order.binding}</TableHead>
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
                                disabled
                              >
                                PO Created
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    : approvedOrders &&
                      approvedOrders
                        .filter(
                          (order) => order.purchase_order_created === null
                        )
                        .map((order, index) => (
                          <TableRow
                            key={order._id ?? index}
                            className="bg-white border-b font-medium text-[17px] hover:bg-gray-200 text-black"
                          >
                            <TableCell className="w-4 p-4 text-[17px]"></TableCell>
                            <TableCell className="px-6 font-medium text-[17px] whitespace-nowrap text-black py-[20px]">
                              {order._id || order._id === "0"
                                ? order._id
                                : "N/A"}
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
                                          <TableHead>
                                            {order.paperSize}
                                          </TableHead>
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
                                          <TableHead>
                                            {order.quantity}
                                          </TableHead>
                                        </TableRow>
                                        <TableRow>
                                          <TableHead className="p-[10px] font-semibold  text-gray-600">
                                            Binding
                                          </TableHead>
                                          <TableHead>{order.binding}</TableHead>
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
                                key={poStatus}
                                className="px-[15px] font-semibold bg-[#36454F] hover:bg-[#172447]"
                                type="button"
                                onClick={() => handleRequestPO(order._id)}
                              >
                                PO Request
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
