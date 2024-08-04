'use client'

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineLoading } from "react-icons/ai";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ErrorBoundary } from 'react-error-boundary';
import PaymentTable from "./paymentTable";
import DeliveryDetail from "./deliveryDetail";
import PressUnits from "./pressUnit";
import PaperDetail from "./paperDetail";
import PlateDetail from "./plateDetail";
import PaperUnit from "./paperUnit";
import Bindery from "./bindery";
import PressUnit from "./prePressUnit";
import Costbreakdown from "./costCalculation";
import PDFGenerator from "./pdfGenerator";
import { Toaster, toast } from 'react-hot-toast';
import {
  Clipboard,
  Truck,
  Printer,
  FileText,
  Square,
  Layers,
  BookOpen,
  Printer as PrinterIcon,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Download,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order, JobCard, CookiesData } from '../../../Schema/erpSchema/jobcardSchema';
import { fetchOrders, fetchJobCard, updateJobCard, createJobCard } from '../../../services/erpServices/jobcardService';
import { parseCookie, clearCookies } from '../../../util/jobard';
import JobcardMenu from "./jobCardMenu";
import ErpSidebar from "../../_components/ErpSidebar";
import { FaCheck } from "react-icons/fa";
import Cookies from "js-cookie";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface CommonComponentProps {
  data: any;
  onChildData: () => void;
  onSave: () => void;
}

const components: Array<{ name: string; component: React.ComponentType<CommonComponentProps> }> = [
  { name: "Payment Table", component: PaymentTable },
  { name: "Delivery Detail", component: DeliveryDetail },
  { name: "Press Unit", component: PressUnit },
  { name: "Paper Detail", component: PaperDetail },
  { name: "Plate Detail", component: PlateDetail },
  { name: "Paper Unit", component: PaperUnit },
  { name: "Bindery", component: Bindery },
  { name: "Press Units", component: PressUnits },
  { name: "Cost Breakdown", component: Costbreakdown },
];

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}
function getIconForComponent(name: string) {
  switch (name) {
    case "Payment Table":
      return <Clipboard size={16} className="ml-2" />;
    case "Delivery Detail":
      return <Truck size={16} className="ml-2" />;
    case "Press Unit":
      return <Printer size={16} className="ml-2" />;
    case "Paper Detail":
      return <FileText size={16} className="ml-2" />;
    case "Plate Detail":
      return <Square size={16} className="ml-2" />;
    case "Paper Unit":
      return <Layers size={16} className="ml-2" />;
    case "Bindery":
      return <BookOpen size={16} className="ml-2" />;
    case "Press Units":
      return <PrinterIcon size={16} className="ml-2" />;
    case "Cost Breakdown":
      return <DollarSign size={16} className="ml-2" />;
    default:
      return null;
  }
}


export default function JobCardPage({ ordersId }: { ordersId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>();
  const [filteredOrder, setFilteredOrder] = useState<Order[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [jobCard, setJobCard] = useState<JobCard | null>(null);
  const [cookiesData, setCookiesData] = useState<CookiesData | null>(null);
  const [reload, setReload] = useState(1);
  const [spinner, setSpinner] = useState(false);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const [savedComponents, setSavedComponents] = useState<Set<number>>(new Set());
  const [allComponentsSaved, setAllComponentsSaved] = useState(false);
  const [ok, setOk] = useState(false);
  const isPlateDetailVisible = components[currentComponentIndex].name === "Plate Detail";

  const handleComponentSave = (index: number) => {
    setSavedComponents(prev => new Set(prev).add(index));
  };

  useEffect(() => {
    fetchOrders().then(setOrders).catch(console.error);
  }, [reload]);

  useEffect(() => {
    setAllComponentsSaved(savedComponents.size === components.length);
  }, [savedComponents]);

  useEffect(() => {
    if (jobCard) {
      let paperData = { paperDetail: jobCard?.paperDetailData }
      let binderyData = { binderyData: jobCard?.bindingData }
      let deliveryData = { deliveryDetail: jobCard?.delivery }
      let PaperUnitsData = { paperData: jobCard?.paperData }
      let paymentData = { servicePaymentList: jobCard?.prePressUnitList }
      let plateData = { plateDetailData: jobCard?.plateDetailData }
      let prePressData = { prePressUnitList: jobCard?.prePressData }
      let pressUnitData = { pressUnitData: jobCard?.pressUnitData }
      let costCalculation = { costCalculation: jobCard?.costCalculation }

      // console.log(paperData, binderyData, deliveryData, PaperUnitsData, paymentData, plateData, prePressData, pressUnitData, costCalculation)
      Cookies.set('paperData', JSON.stringify(paperData))
      Cookies.set('binderyData', JSON.stringify(binderyData))
      Cookies.set('deliveryData', JSON.stringify(deliveryData))
      Cookies.set('PaperUnitsData', JSON.stringify(PaperUnitsData))
      Cookies.set('paymentData', JSON.stringify(paymentData))
      Cookies.set('plateData', JSON.stringify(plateData))
      Cookies.set('prePressData', JSON.stringify(prePressData))
      Cookies.set('pressUnitData', JSON.stringify(pressUnitData))
      Cookies.set('costCalculation', JSON.stringify(costCalculation))
      setOk(true);
    }

  }, [jobCard])

  useEffect(() => {

    const handleJobCard = async () => {
      if (orders.length > 0 && ordersId) {

        await fetchJobCard(ordersId as string).then(setJobCard).catch(console.error);

        // Cookies.remove('paperData')
        // Cookies.remove('binderyData')
        // Cookies.remove('deliveryData')
        // Cookies.remove('PaperUnitsData')
        // Cookies.remove('paymentData')
        // Cookies.remove('plateData')
        // Cookies.remove('prePressData')
        // Cookies.remove('pressUnitData')
        // Cookies.remove('costCalculation')


        handleOrderChange(ordersId as string);


      }

    }
    handleJobCard();

  }, [orders, ordersId]);

  useEffect(() => {
    if (jobCard?.projectTracking?.jobCard) {
      handleGeneratePDF();
    }
  }, [jobCard]);

  const handleOrderChange = (id: string) => {
    setSelectedOrder(id);
    setOrderId(id);
    if (dropdownRef.current) {
      dropdownRef.current.style.display = "none";
    }
    // const filteredOrderWithId = orders.filter((order) => order.orderId === id);
    // if (filteredOrderWithId.length > 0) {
    //   const name = filteredOrderWithId[0].customer;
    //   (document.getElementById("input") as HTMLInputElement).value = name;
    // } else {
    //   console.log("Order not found");
    // }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filteredOrders = orders.filter((order) =>
      order.customer.toLowerCase().startsWith(value)
    );
    setFilteredOrder(filteredOrders);
    if (dropdownRef.current) {
      dropdownRef.current.style.display = "block";
    }
  };

  const onUpdate = async () => {
    setSpinner(true);
    const cookiesData = getCookiesData();
    try {
      const response = await updateJobCard(orderId!, cookiesData);
      setSpinner(false);
      toast.success(response);
      clearCookies();
      setReload(reload + 1);
    } catch (error) {
      console.error("Error updating job card:", error);
      setSpinner(false);
      toast.error("Failed to update job card");
    }
  };

  const onSubmit = async () => {
    if (!allComponentsSaved) {
      toast.error("Please save all components before submitting.");
      return;
    }
    setSpinner(true);
    const cookiesData = getCookiesData();
    try {
      const response = await createJobCard(orderId!, cookiesData);
      setSpinner(false);
      toast.success(response);
      clearCookies();
      setReload(reload + 1);
    } catch (error) {
      console.error("Error creating job card:", error);
      setSpinner(false);
      toast.error("Failed to create job card");
    }
  };

  const handleGeneratePDF = () => {
    let cookiesData = getCookiesData();
    let cookieData = {
      ...cookiesData,
      job_card_id: jobCard?.job_card_id
    }
    setCookiesData(cookieData);
  };

  const getCookiesData = (): CookiesData => {
    return {
      paperDetailData: parseCookie('paperData')?.paperDetail || null,
      binderyData: parseCookie('binderyData')?.binderyData || null,
      deliveryDetail: parseCookie('deliveryData')?.deliveryDetail || null,
      paperData: parseCookie('PaperUnitsData')?.paperData || null,
      prePressUnitList: parseCookie('paymentData')?.servicePaymentList || null,
      plateDetailData: parseCookie('plateData')?.plateDetailData || null,
      prePressData: parseCookie('prePressData')?.prePressUnitList || null,
      pressUnitData: parseCookie('pressUnitData')?.pressUnitData || null,
      costCalculation: parseCookie('costCalculation')?.costCalculation || null,
    };
  };

  const nextComponent = () => {
    setCurrentComponentIndex((prevIndex) =>
      prevIndex < components.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const prevComponent = () => {
    setCurrentComponentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex h-screen bg-gray-100">
        <div className="">
          <ErpSidebar />
        </div>
        <div className="flex h-screen font-archivo">
          {/* Left side - Navigation */}
          <div className="w-1/2 p-8 bg-gray-100 overflow-y-auto">
            <div className="flex justify-between">
              <div className="flex ">
                <h2 className="text-3xl font-extrabold mb-4">Job Card</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="w-5 h-5 text-gray-500 ml-2 mt-2 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is the job card page where tasks are assigned to employees.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Customer Name */}
              <div>
                <h3 className="underline font-bold mt-[6px] mb-4">{orders.find(order => order.orderId === orderId)?.customer}</h3>
              </div>
            </div>

            <div className="mt-[10px]">
              {orderId ? <JobcardMenu orderId={orderId} customerName={""} /> : null}
            </div>

            {/* Component navigation buttons */}
            <div className="space-y-2">
        {components.map((comp, index) => (
          <Button
            key={comp.name}
            onClick={() => setCurrentComponentIndex(index)}
            variant={currentComponentIndex === index ? "default" : "outline"}
            className="w-full "
          >
            {getIconForComponent(comp.name)}
            <span className="ml-2">{comp.name}</span>
            {savedComponents.has(index) && <FaCheck className="text-green-500 ml-2" />}
          </Button>
        ))}
      </div>

            {/* PDF Download and Submit/Update buttons */}
            <div className="mt-8 space-y-4">
              {Object.keys(cookiesData || {}).length > 0 && (
                <PDFDownloadLink
                  document={<PDFGenerator data={cookiesData!} />}
                  fileName="jobcard.pdf"
                >
                  {({ loading }) => (
                    <Button className="w-full flex justify-center items-center" disabled={loading}>
                      {loading ? <AiOutlineLoading className="animate-spin" /> : (
                        <>
                          <Download className="mr-2" size={16} />
                          Download PDF
                        </>
                      )}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
              <Button
                onClick={jobCard?.projectTracking?.jobCard ? onUpdate : onSubmit}
                disabled={spinner}
                className="w-full flex justify-center items-center"
              >
                {spinner ? <AiOutlineLoading className="animate-spin" /> : (
                  <>
                    <Send className="mr-2" size={16} />
                    {jobCard?.projectTracking?.jobCard ? "Update" : "Submit"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right side - Component display */}
          <div className={`p-8 bg-white flex flex-col justify-between h-[100vh] ${isPlateDetailVisible ? 'w-8/9' : 'w-2/3'}`}>
            <div className="flex-grow flex items-center justify-center ">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentComponentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full "
                >
                  {jobCard && ok && React.createElement(components[currentComponentIndex].component, {
                    data: jobCard[components[currentComponentIndex].name.toLowerCase().replace(' ', '')] as any,
                    onChildData: () => { },
                    onSave: () => handleComponentSave(currentComponentIndex)
                  } as CommonComponentProps)}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-between">
              <Button onClick={prevComponent} disabled={currentComponentIndex === 0} className="flex items-center">
                <ChevronLeft className="mr-2" size={16} />
                Previous
              </Button>
              <Button onClick={nextComponent} disabled={currentComponentIndex === components.length - 1} className="flex items-center">
                Next
                <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>

        </div>
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}