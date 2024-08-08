"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineClockCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { FaCheckCircle, FaTrash, FaClock, FaTimesCircle } from "react-icons/fa";
import OrderStatusList from "./_components/OrderStatusList";
import {
  Order,
  Step,
  TrackingData,
} from "../../Schema/erpSchema/dashboardSchema";
import * as orderService from "../../services/erpServices/dasboardService";
import InventorySidebar from "../_components/ErpSidebar";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { HoverCard } from "@radix-ui/react-hover-card";
import { ClipboardList, Info, Package, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const AdminDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(() => {
    const currentDate = new Date();
    const pastDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
    return pastDate.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filteredOrderDetails, setFilteredOrderDetails] = useState<Order[]>([]);
  const [filteredOrder, setFilteredOrder] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order[]>([]);
  const [pending, setPending] = useState<number>(0);
  const [approved, setApproved] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([
    { name: "Order Slip", active: false, key: "orderSlip" },
    { name: "Job Card", active: false, key: "jobCard" },
    { name: "Paper Cutting", active: false, key: "paperCutting" },
    { name: "Plate Preparation", active: false, key: "platePreparation" },
    { name: "Printing", active: false, key: "printing" },
    { name: "Post Press", active: false, key: "postPress" },
    { name: "Delivery", active: false, key: "delivery" },
    { name: "End", active: false, key: "end" },
  ]);

  const [orderId, setOrderId] = useState<string>("");
  const [lastOrderStatus, setLastOrderStatus] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [currentProcess, setCurrentProcess] = useState<string>("");
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const allOrders = await orderService.fetchOrders();
        setRecentOrders(allOrders);
        setOrderDetails(allOrders);
        setFilteredOrder(
          allOrders.sort((a, b) => Number(a.orderId) - Number(b.orderId))
        );
        setFilteredOrderDetails(allOrders);

        let pendingCount = 0;
        let approvedCount = 0;
        let completedCount = 0;
        allOrders.forEach((order) => {
          if (order.status === "PENDING") pendingCount++;
          if (order.status === "APPROVED") approvedCount++;
          if (order.status === "COMPLETED") completedCount++;
        });
        setPending(pendingCount);
        setApproved(approvedCount);
        setCompleted(completedCount);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, []);

  useEffect(() => {
    const recentOrder = orderDetails[orderDetails.length - 1];
    setLastOrder(recentOrder);

    const activeStep = steps.reduce((lastActiveIndex, step, index) => {
      if (step.active) {
        return index;
      }
      return lastActiveIndex;
    }, -1);

    setCurrentProcess(steps[activeStep]?.name || "");
  }, [orderDetails, steps]);

  useEffect(() => {
    const lastOrder = orderDetails[orderDetails.length - 1];
    if (lastOrder) {
      setLastOrderStatus(lastOrder.status);
      setCustomerName(lastOrder.customer);
    }
  }, [orderDetails]);

  const handleViewDetails = async (order: string) => {
    try {
      const response = await orderService.fetchJobCard(order);
      setSelectedOrder(response);
      console.log(response);
      document.getElementById("my-drawer-4")?.setAttribute("checked", "true");
    } catch (error) {
      console.error("Error fetching job card:", error);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const response = await orderService.fetchOrderDetails(id);
      console.log(response);
      // setFilteredOrderCost(response);
      document.getElementById("my-drawer-4")?.setAttribute("checked", "true");
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredOrders = orderDetails.filter((order) =>
      order.customer.toLowerCase().startsWith(value)
    );
    setFilteredOrder(filteredOrders);
    if (dropdownRef.current) {
      dropdownRef.current.style.display = "block";
    }
  };

  const handleTracking = async (id: string) => {
    console.log(id);
    try {
      const trackingData = await orderService.fetchProjectTracking(id);

      const updatedSteps = steps.map((step) => ({
        ...step,
        active: trackingData[step.key],
      }));
      console.log(updatedSteps);
      setSteps(updatedSteps);
      document.getElementById("my_modal_1")?.setAttribute("open", "true");
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    }
  };

  const handleDone = async () => {
    const stepData = steps.reduce((acc, step) => {
      acc[step.key] = step.active;
      return acc;
    }, {} as TrackingData);

    console.log(stepData);

    try {
      await orderService.updateProjectTracking(orderId, stepData);
      console.log("Data sent successfully");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleBack = () => {
    setSteps((prevSteps) => {
      const lastActiveIndex = prevSteps.reduce(
        (lastIndex, step, index) => (step.active ? index : lastIndex),
        -1
      );
      if (lastActiveIndex > 0) {
        const newSteps = prevSteps.map((step, index) => ({
          ...step,
          active: index < lastActiveIndex,
        }));
        return newSteps;
      }
      return prevSteps;
    });
  };

  const handleNext = () => {
    setSteps((prevSteps) => {
      const lastActiveIndex = prevSteps.reduce(
        (lastIndex, step, index) => (step.active ? index : lastIndex),
        -1
      );
      if (lastActiveIndex < prevSteps.length - 1) {
        const newSteps = prevSteps.map((step, index) => ({
          ...step,
          active: index <= lastActiveIndex + 1,
        }));
        return newSteps;
      }
      return prevSteps;
    });
  };

  // const handleJobCard = (id: string) => {
  //   console.log(id);
  //   router.push({
  //     pathname: "/jobcard",
  //     query: { ordersId: id },
  //   });
  // };

  // const handleOrderChange = (id: string, customer: string) => {
  //   setSelectedOrder(id);

  //   if (dropdownRef.current) {
  //     dropdownRef.current.style.display = "none";
  //   }
  //   const filtered = orderDetails.filter((order) => order.customer == customer);
  //   setFilteredOrderDetails(filtered);
  //   const filteredOrderWithId = orderDetails.filter(
  //     (order) => order.orderId === id
  //   );
  //   if (filteredOrderWithId.length > 0) {
  //     const name = filteredOrderWithId[0].customer;
  //     const inputElement = document.getElementById("input") as HTMLInputElement;
  //     if (inputElement) inputElement.value = name;
  //   } else {
  //     console.log("Order not found");
  //   }
  //   console.log("ok");
  // };

  useEffect(() => {
    // Simulating inventory items fetch
    setInventoryItems([
      { itemName: "Paper A4", type: "Paper", availability: "In Stock" },
      { itemName: "Ink Cartridge", type: "Ink", availability: "Low Stock" },
      // Add more items as needed
    ]);

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % inventoryItems.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [inventoryItems.length]);

  const handleCancel = async (id: string) => {
    try {
      await orderService.cancelOrder(id);
      console.log("Order Cancelled successfully");
    } catch (error) {
      console.error("Error Cancelling Order:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-archivo">
      <InventorySidebar />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="ml-2 hover:cursor-pointer hover:text-blue-900" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p>
                Welcome to the Admin Dashboard. Here you can manage orders and
                inventory.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Item
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {inventoryItems[currentIndex] && (
                  <motion.div
                    key={inventoryItems[currentIndex].itemName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-2xl font-bold">
                      {inventoryItems[currentIndex].itemName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Type: {inventoryItems[currentIndex].type} | Availability:{" "}
                      {inventoryItems[currentIndex].availability}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Orders
              </CardTitle>
              <Printer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pending}</div>
              <p className="text-xs text-muted-foreground">
                {pending} orders waiting to be processed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Orders
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completed}</div>
              <p className="text-xs text-muted-foreground">
                {completed} orders finalized
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.slice(0, 5).map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className=" ">{order.orderId}</TableCell>
                      <TableCell className=" ">{order.customer}</TableCell>
                      <TableCell className=" ">{order.status}</TableCell>
                      <TableCell className=" ">
                        Rs.{order.estimatedAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                className="mt-4 w-full"
                onClick={() => router.push("/erp/order")}
              >
                View all orders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusList orderDetails={orderDetails} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
