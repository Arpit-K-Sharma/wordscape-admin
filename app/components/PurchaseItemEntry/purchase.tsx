"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import InventorySidebar from "../Sidebar/InventorySidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, RefreshCw } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Logo from '../../images/LogoBG.webp';

interface PurchaseOrderItem {
  itemId: string;
  quantityFromVendor: number;
  quantityFromStock: number;
  itemCode: string | null;
  rate: number | null;
  amount: number | null;
}

interface PurchaseEntry {
  _id: string;
  vendorId: string;
  isCompleted: boolean;
  items: PurchaseOrderItem[];
  tag: string | null;
  remarks: string | null;
  image: string | null;
  discount: number | null;
  vat: number | null;
  grandTotal: number | null;
  invoiceNo: string | null;
  invoiceDate: string | null;
}

interface PurchaseOrder {
  _id: string;
  orderId: string;
  isCompleted: boolean;
  purchaseEntry: PurchaseEntry[];
}

interface InventoryItem {
  _id: string;
  itemName: string;
  availability: number;
  type: string;
}

interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

const PurchaseWithEntry: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    null
  );
  const router = useRouter();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseOrders, inventoryItems, vendors] = await Promise.all([
          axios.get("http://127.0.0.1:8000/purchase_orders_with_entries"),
          axios.get("http://127.0.0.1:8000/inventory"),
          axios.get("http://127.0.0.1:8000/vendors"),
        ]);

        setPurchaseOrders(purchaseOrders.data.data);
        setInventoryItems(inventoryItems.data.data);
        setVendors(vendors.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDetailsClick = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const getItemDetails = (itemId: string) => {
    return inventoryItems.find((item) => item._id === itemId);
  };

  const getVendorDetails = (vendorId: string) => {
    return vendors.find((vendor) => vendor._id === vendorId);
  };

  const handleReorderClick = (orderId: string) => {
    router.push(`/inventory/entry/${orderId}?reorder=True`)
  };

  const contentRef = useRef(null);
  const downloadPDF = async () => {
    if (!contentRef.current || !isDetailsDialogOpen) {
      console.error('Content not available or dialog not open');
      return;
    }

    setLoader(true);

    // Clone the content to remove scrollbars and ensure all content is visible
    const clonedContent = contentRef.current.cloneNode(true);
    clonedContent.style.height = 'auto';
    clonedContent.style.overflow = 'visible';
    document.body.appendChild(clonedContent);

    const scrollHeight = clonedContent.scrollHeight;
    const viewportHeight = window.innerHeight;
    const numPages = Math.ceil(scrollHeight / viewportHeight);

    const canvasArray = [];

    // Scroll through the content and capture multiple screenshots
    for (let i = 0; i < numPages; i++) {
      window.scrollTo(0, i * viewportHeight);
      await html2canvas(clonedContent, {
        logging: true,
        useCORS: true,
        allowTaint: true,
        scale: 2,
        scrollY: -window.scrollY
      }).then((canvas) => {
        canvasArray.push(canvas);
      });
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add each canvas to the PDF
    for (let i = 0; i < canvasArray.length; i++) {
      const canvas = canvasArray[i];
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const zoomFactor = 3;
      const widthReduction = 0.7;

      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const scaledWidth = pageWidth * widthReduction;
      const scaledHeight = (scaledWidth / imgWidth) * imgHeight;
      // Calculate the position to center the image
      const imgX = (pageWidth - scaledWidth) / 2;
      const imgY = 10;

      const cropWidth = imgWidth / zoomFactor;
      const cropHeight = imgHeight / zoomFactor;
      const cropX = (imgWidth - cropWidth) / 2;
      const cropY = (imgHeight - cropHeight) / 2;

      pdf.addImage(
        imgData, 'JPEG',
        imgX, imgY, scaledWidth, scaledHeight,
        undefined,
        'FAST',
        0,
        cropX, cropY, cropWidth, cropHeight
      );


      if (i < canvasArray.length - 1) {
        pdf.addPage();
      }
    }

    pdf.save('purchase_order_details.pdf');

    // Clean up
    document.body.removeChild(clonedContent);
    setLoader(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
      <InventorySidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Purchase Orders
          <span className="text-2xl font-normal text-gray-600 ml-2">
            (Items received from Vendors)
          </span>
        </h1>
        <div className="grid-flow-row grid-row-1 md:grid-row-2 lg:grid-row-3 gap-6 p-6">
          {Array.isArray(purchaseOrders) && purchaseOrders.length > 0 ? (
            <div>
              {purchaseOrders.map((order) => (
                <Card
                  key={order._id}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300 mb-[20px]"
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-blue-600">
                        {order.orderId}
                      </span>
                      <span className="text-sm font-medium text-green-800">
                        {order.isCompleted ? "Completed" : "Pending"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetailsClick(order)}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          Grand Total: Rs.{" "}
                          {order.purchaseEntry
                            .reduce(
                              (total, purchase) =>
                                total + (purchase.grandTotal || 0),
                              0
                            )
                            .toFixed(2)}
                        </p>
                        <p>
                          Invoice No:{" "}
                          {order.purchaseEntry
                            .map((purchase) => purchase.invoiceNo)
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </p>
                        <p>
                          Invoice Date:{" "}
                          {order.purchaseEntry
                            .map((purchase) => purchase.invoiceDate)
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </p>
                        {order.purchaseEntry.some((purchase) => purchase.tag) && (
                          <p>
                            Tags:{" "}
                            {order.purchaseEntry
                              .map((purchase) => purchase.tag)
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                        <span
                          className="text-sm font-medium mt-[5px] cursor-pointer text-orange-500 flex justify-end"
                          onClick={() => handleReorderClick(order.orderId)}
                        >
                          <RefreshCw className="mr-1 h-4 w-4" />
                          Reorder
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No purchase orders available.</p>
          )}
        </div>
        <div className="print-slip">
          <Dialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
          >
            <DialogContent className="print max-w-4xl font-archivo">
              <div ref={contentRef}>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-gray-800 mb-4">
                    <div className="flex flex-col items-center justify-center">
                      <div>
                        <img src={Logo.src} width={100} />
                      </div>
                      <div>
                        Purchase Order Details
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="print h-[60vh]">
                  {selectedOrder?.purchaseEntry.map((purchase) => {
                    const vendorDetails = getVendorDetails(purchase.vendorId);
                    return (
                      <div
                        key={purchase._id}
                        className="mb-8 pb-8 border border-gray-200 rounded-lg p-4 last:mb-0"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-black text-zinc-900 underline-offset-1">
                            {vendorDetails?.vendorName || "Unknown Vendor"}
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p>
                              <span className="font-medium">Address:</span>{" "}
                              {vendorDetails?.vendorAddress}
                            </p>
                            <p>
                              <span className="font-medium">VAT:</span>{" "}
                              {vendorDetails?.vendorVAT}
                            </p>
                            <p>
                              <span className="font-medium">Phone:</span>{" "}
                              {vendorDetails?.vendorPhone}
                            </p>
                          </div>
                          <div>
                            <p>
                              <span className="font-medium">Invoice No:</span>{" "}
                              {purchase.invoiceNo || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium">Invoice Date:</span>{" "}
                              {purchase.invoiceDate || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium">Grand Total:</span> Rs.{" "}
                              {purchase.grandTotal?.toFixed(2) || "N/A"}
                            </p>
                            {purchase.tag && (
                              <p>
                                <span className="font-medium">Tag:</span>{" "}
                                {purchase.tag}
                              </p>
                            )}
                            {purchase.remarks && (
                              <p>
                                <span className="font-medium">Remarks:</span>{" "}
                                {purchase.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                        <h4 className="text-lg font-bold mb-2 text-zinc-800">
                          Items
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {purchase.items.map((item) => {
                            const itemDetails = getItemDetails(item.itemId);
                            return (
                              <div
                                key={item.itemId}
                                className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                              >
                                <h5 className="font-semibold mb-2 flex justify-between items-center">
                                  <span>
                                    {itemDetails?.itemName || "Unknown Item"}
                                  </span>
                                </h5>
                                <div className="text-sm">
                                  <p>
                                    <span className="font-medium">Type:</span>{" "}
                                    {itemDetails?.type || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Quantity (Vendor):
                                    </span>{" "}
                                    {item.quantityFromVendor}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Quantity (Stock):
                                    </span>{" "}
                                    {item.quantityFromStock}
                                  </p>
                                  <p>
                                    <span className="font-medium">Item Code:</span>{" "}
                                    {item.itemCode || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-medium">Rate:</span> Rs.{" "}
                                    {item.rate?.toFixed(2) || "N/A"}
                                  </p>
                                  <p>
                                    <span className="font-medium">Amount:</span> Rs.{" "}
                                    {item.amount?.toFixed(2) || "N/A"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </div>
              <Button
                className="receipt-modal-download-button"
                onClick={downloadPDF}
                disabled={!(loader === false)}
              >
                {loader ? (
                  <span>Downloading</span>
                ) : (
                  <span>Download</span>
                )}

              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PurchaseWithEntry;