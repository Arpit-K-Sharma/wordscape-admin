import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { Search, User, Clock, XCircle, CheckCircle, Trash2, Timer, Maximize2, FileText, Hash, Book, Car, Calendar, Scissors, Paintbrush, Layers, Printer, Droplet, MessageSquare, DollarSign, InfoIcon } from 'lucide-react';
import { Order, SelectedOrder, Step } from '../../../Schema/erpSchema/OrderSchema';
import * as orderService from '../../../services/erpServices/orderService';
import ErpSidebar from '../../_components/ErpSidebar';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface OrderResponse {
  response: Order[];
  totalElements: number;
}


const Orders: React.FC = () => {
  const [sortDirection, setSortDirection] = useState<string>('date_asc');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [filteredOrderDetails, setFilteredOrderDetails] = useState<Order[]>([]);
  const [filteredOrder, setFilteredOrder] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { name: "Order Slip", active: false, key: "orderSlip" },
    { name: "Job Card", active: false, key: "jobCard" },
    { name: "Paper Cutting", active: false, key: "paperCutting" },
    { name: "Plate Preparation", active: false, key: "platePreparation" },
    { name: "Printing", active: false, key: "printing" },
    { name: "Post Press", active: false, key: "postPress" },
    { name: "Delivery", active: false, key: "delivery" },
    { name: "Invoice", active: false, key: "invoice" },
    { name: "End", active: false, key: "end" },
  ]);
  const [orderid, setOrderid] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>();
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [field, direction] = sortDirection.split('_');
        console.log(field, direction)
        const response = await orderService.fetchOrders(page, field, direction);
        console.log(response)
        setFilteredOrderDetails(response.response);
        setPageLimit(Math.round(response.totalElements) / 10);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [page, sortDirection]);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleSort = (field: string) => {
    const newDirection = sortDirection === `${field}_asc` ? 'desc' : 'asc';
    setSortDirection(`${field}_${newDirection}`);
  };

  const handleViewDetails = async (orderId: string) => {
    try {
      const response = await orderService.fetchOrderDetails(orderId);
      setSelectedOrder(response);
      setIsOpen(true)
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredOrders = filteredOrderDetails.filter((order) =>
      order.customer.toLowerCase().includes(value)
    );
    setFilteredOrder(filteredOrders);
  };

  const handleTracking = async (id: string) => {
    try {
      const trackingData = await orderService.fetchTracking(id);
      const updatedSteps = steps.map((step) => ({
        ...step,
        active: trackingData[step.key],
      }));
      setSteps(updatedSteps);
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    }
  };

  const handleNext = () => {
    const lastActiveIndex = steps.reduce(
      (lastIndex, step, index) => (step.active ? index : lastIndex),
      -1
    );
    if (lastActiveIndex < steps.length - 1) {
      const newSteps = steps.map((step, index) => ({
        ...step,
        active: index <= lastActiveIndex + 1,
      }));

      // Call handleDone with the new step data
      handleDone(newSteps);

      // Update the UI
      setSteps(newSteps);
    }
  };

  const handleBack = () => {
    const lastActiveIndex = steps.reduce(
      (lastIndex, step, index) => (step.active ? index : lastIndex),
      -1
    );
    if (lastActiveIndex > 0) {
      const newSteps = steps.map((step, index) => ({
        ...step,
        active: index < lastActiveIndex,
      }));

      // Call handleDone with the new step data
      handleDone(newSteps);

      // Update the UI
      setSteps(newSteps);
    }
  };

  const handleDone = async (updatedSteps: Step[]) => {
    const stepData = updatedSteps.reduce((acc, step) => {
      acc[step.key] = step.active;
      return acc;
    }, {} as Record<string, boolean>);

    console.log(stepData);

    try {
      await orderService.updateTracking(orderid!, stepData);
      toast.success("Tracking updated successfully", { id: 'tracking-update' });
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("Failed to update tracking", { id: 'tracking-update' });
    }
  };


  const handleJobCard = (id: string) => {
    router.push(`/erp/jobcard/${id}`);
  };

  const handleCancel = async (id: string) => {
    setOrderid(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await orderService.cancelOrder(orderid!);

      const filtered = filteredOrderDetails.map((order) =>
        order.orderId === orderid ? { ...order, status: "CANCELED" } : order
      );
      setFilteredOrderDetails(filtered);

      // Close the dialog
      setIsDeleteDialogOpen(false);

      // Show success toast
      toast.success("Order cancelled successfully", { id: 'order-cancel' });
    } catch (error) {
      console.error("Error Cancelling Order:", error);
      toast.error("Failed to cancel order", { id: 'order-cancel' });
    }
  };

  const handleDownloadFile = async (orderId: string) => {
    try {
      const blob = await orderService.downloadFile(orderId);
      if (blob.size === 0) {
        toast.error("PDF wasn't uploaded by Customer");
        return;
      }
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("PDF does not exist.");
    }
  };

  const handleViewInvoice = async (id: string) => {
    try {
      const blob = await orderService.fetchInvoice(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  const updateDeadline = async () => {
    if (!selectedOrder?.orderId) {
      alert("Order ID is missing.");
      return;
    }

    try {
      await orderService.updateDeadline(selectedOrder.orderId, selectedOrder.deadline!);
      console.log("Update successful");
      alert("Deadline updated successfully!");
    } catch (error) {
      console.error("Failed to update deadline:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ErpSidebar />
      {/* <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden fixed top-4 left-4 z-10">
            Open Sidebar
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Order Management</SheetTitle>
            <SheetDescription>
              Navigate through different sections of order management.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
            <Button variant="ghost" className="w-full justify-start">Orders</Button>
            <Button variant="ghost" className="w-full justify-start">Customers</Button>
            <Button variant="ghost" className="w-full justify-start">Reports</Button>
          </div>
        </SheetContent>
      </Sheet> */}

      <div className="flex-1 overflow-auto p-8">
        <div className="text-3xl font-bold mb-[20px] flex justify-center items-center"><h2 >Orders</h2><TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>This is the order page where job cards are managed, order details are viewed, and statuses are updated.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider></div>

        <div className="relative mb-[20px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search orders by customer name"
            onChange={handleInput}
            id="input"
            className="max-w-sm pl-10 bg-white"
          />
        </div>

        <Table className="bg-white rounded-lg overflow-hidden ">
          <TableHeader >
            <TableRow >
              <TableHead className='text-white bg-[#07071f]'>Order ID</TableHead>
              <TableHead className='text-white bg-[#07071f]'>
                <Button
                  className='bg-[#07071f] text-white'
                  variant="ghost"
                  onClick={() => handleSort("date")}
                >
                  Date {sortDirection.startsWith("date_") ? (sortDirection === "date_asc" ? "↑" : "↓") : ""}
                </Button>
              </TableHead>
              <TableHead className='text-white bg-[#07071f] text-center'>Delivery Date</TableHead>
              <TableHead className='text-white bg-[#07071f] text-center'>Order Details</TableHead>
              <TableHead className='text-white bg-[#07071f] text-center'>Job Card</TableHead>
              <TableHead className='text-white bg-[#07071f] text-center'>View Tracking</TableHead>
              <TableHead className='text-white bg-[#07071f] text-center'>Status</TableHead>
              <TableHead className='text-white bg-[#07071f] text-center'>View Invoice</TableHead>
              <TableHead className='text-white bg-[#07071f] text-center'>Files</TableHead>
              <TableHead className='text-white bg-[#07071f] text-center'>Cancel Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrderDetails && filteredOrderDetails.map((details) => (
              <TableRow key={details.orderId}>
                <TableCell className='w-[50px] truncate'>{details.orderId}</TableCell>
                <TableCell>{new Date(details.date).toLocaleDateString()}</TableCell>
                <TableCell className='text-center'>
                  {details.delivery && details.delivery.deliveryDate
                    ? new Date(details.delivery.deliveryDate).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Button variant="secondary" onClick={() => handleViewDetails(details.orderId)}>
                    View details
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="secondary" onClick={() => handleJobCard(details.orderId)}>
                    Job card
                  </Button>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        onClick={() => { handleTracking(details.orderId); setOrderid(details.orderId); }}
                        disabled={details.status === "CANCELED"}
                      >
                        Track It
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Order Tracking</DialogTitle>
                        <DialogDescription>
                          Track the progress of your order.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Progress value={(steps.filter(step => step.active).length / steps.length) * 100} className="w-full" />
                        <ul className="mt-4 space-y-2">
                          {steps.map((step, index) => (
                            <li key={index} className={`flex items-center ${step.active ? 'text-primary' : 'text-muted-foreground'}`}>
                              {step.active ? '✓' : '○'} {step.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-between">
                        <Button onClick={handleBack}>Back</Button>
                        <Button onClick={handleNext}>Next</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {details.status === "PENDING" ? (
                      <Clock className="text-orange-500" size={20} />
                    ) : details.status === "APPROVED" || details.status === "COMPLETED" ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : details.status === "CANCELED" ? (
                      <XCircle className="text-red-500" size={20} />
                    ) : null}
                    {details.status}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="secondary" onClick={() => handleViewInvoice(details.orderId)}>
                    View Invoice
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="secondary" onClick={() => handleDownloadFile(details.orderId)}>
                    Download
                  </Button>
                </TableCell>
                <TableCell>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" onClick={() => handleCancel(details.orderId)}>
                        <Trash2 className="text-red-500" size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Order</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel this order?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Close</Button>
                        <Button variant="destructive" onClick={handleDelete}>Yes, Cancel</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
            Previous
          </Button>
          <Button variant="outline" disabled>
            Page {page + 1}
          </Button>
          <Button variant="outline" onClick={() => setPage(page + 1)} disabled={pageLimit !== undefined && page >= pageLimit - 1}>
            Next
          </Button>
        </div>

        {/* Order Details Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="overflow-y-auto w-[700px] max-w-full">
            <SheetHeader>
              <SheetTitle>Order Details</SheetTitle>
            </SheetHeader>
            {selectedOrder && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <User className="mr-2 text-gray-600" />
                  <span className="font-semibold">Customer Name:</span>
                  <span className="ml-2">{selectedOrder.customer?.fullName || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Timer className="mr-2 text-gray-600" />
                  <span className="font-semibold">Ordered Date:</span>
                  <span className="ml-2">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Maximize2 className="mr-2 text-gray-600" />
                  <span className="font-semibold">Paper Size:</span>
                  <span className="ml-2">{selectedOrder.paperSize}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-2 text-gray-600" />
                  <span className="font-semibold">Pages:</span>
                  <span className="ml-2">{selectedOrder.pages}</span>
                </div>
                <div className="flex items-center">
                  <Hash className="mr-2 text-gray-600" />
                  <span className="font-semibold">Quantity:</span>
                  <span className="ml-2">{selectedOrder.quantity}</span>
                </div>
                <div className="flex items-center">
                  <Book className="mr-2 text-gray-600" />
                  <span className="font-semibold">Binding Type:</span>
                  <span className="ml-2">{selectedOrder.binding || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Scissors className="mr-2 text-gray-600" />
                  <span className="font-semibold">Cover Treatment Type:</span>
                  <span className="ml-2">{selectedOrder.coverTreatment?.coverTreatmentType || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Paintbrush className="mr-2 text-gray-600" />
                  <span className="font-semibold">Inner Paper Type:</span>
                  <span className="ml-2">
                    {selectedOrder.innerPaper?.paperType || "N/A"}{" "}
                    <span className="font-bold">| Rs {selectedOrder.innerPaper?.rate || "N/A"}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Layers className="mr-2 text-gray-600" />
                  <span className="font-semibold">Inner Paper Thickness:</span>
                  <span className="ml-2">{selectedOrder.innerPaperThickness || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Paintbrush className="mr-2 text-gray-600" />
                  <span className="font-semibold">Outer Paper Type:</span>
                  <span className="ml-2">
                    {selectedOrder.outerPaper?.paperType || "N/A"}{" "}
                    <span className="font-bold">| Rs {selectedOrder.outerPaper?.rate || "N/A"}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Layers className="mr-2 text-gray-600" />
                  <span className="font-semibold">Outer Paper Thickness:</span>
                  <span className="ml-2">{selectedOrder.outerPaperThickness || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Printer className="mr-2 text-gray-600" />
                  <span className="font-semibold">Cover Lamination:</span>
                  <span className="ml-2">
                    {selectedOrder.outerLamination?.laminationType || "N/A"}{" "}
                    <span className="font-bold">| Rs {selectedOrder.outerLamination?.rate || "N/A"}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Droplet className="mr-2 text-gray-600" />
                  <span className="font-semibold">Ink Type:</span>
                  <span className="ml-2">{selectedOrder.inkType}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="mr-2 text-gray-600" />
                  <span className="font-semibold">Remarks:</span>
                  <span className="ml-2">{selectedOrder.remarks || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-gray-600" />
                  <span className="font-semibold">Estimated amount:</span>
                  <span className="ml-2">Rs. {selectedOrder.estimatedAmount}</span>
                </div>
                <div className="flex items-center">
                  <Car className="mr-2 text-gray-600" />
                  <span className="font-semibold">Delivery Option:</span>
                  <span className="ml-2">{selectedOrder.deliveryOption || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-600" />
                  <span className="font-semibold">Deadline:</span>
                  <div className="ml-2 flex items-center gap-2">
                    <Input
                      type="date"
                      value={selectedOrder.deadline ? new Date(selectedOrder.deadline).toISOString().split("T")[0] : ""}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, deadline: e.target.value })}
                      disabled={!isEditable}
                      className="w-40"
                    />
                    <Button onClick={isEditable ? updateDeadline : toggleEdit}>
                      {isEditable ? "Save" : "Change"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default Orders;