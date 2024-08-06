"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DrawerTest from "./drawerTest";
import {
  PaperSize,
  SheetSize,
  Paper,
  Plate,
  Binding,
  Lamination,
  CoverTreatment,
  Ink,
} from "../../../Schema/erpSchema/costCalculationSchema";
import {
  getPaperSizes,
  getSheetSizes,
  getPapers,
  getPlates,
  getBindings,
  getLaminations,
  getCoverTreatments,
  getInks,
} from "../../../services/erpServices/costCalculationService";
import ErpSidebar from "../../_components/ErpSidebar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CostCalculationPage() {
  const [paperSizes, setPaperSizes] = useState<PaperSize[]>([]);
  const [sheetSizes, setSheetSizes] = useState<SheetSize[]>([]);
  const [length, setLength] = useState("");
  const [standardLength, setStandardLength] = useState("");
  const [standardBreadth, setStandardBreadth] = useState("");
  const [paperTypes, setPaperTypes] = useState<Paper[]>([]);
  const [selectedOuterLaminationType, setSelectedOuterLaminationType] =
    useState("");
  const [outerLaminationRate, setOuterLaminationRate] = useState(0);
  const [breadth, setBreadth] = useState("");
  const [paperLength, setPaperLength] = useState("");
  const [paperBreadth, setPaperBreadth] = useState("");
  const [sheetLength, setSheetLength] = useState("");
  const [sheetBreadth, setSheetBreadth] = useState("");
  const [outerPaperType, setOuterPaperType] = useState<Paper[]>([]);
  const [outerPaperThickness, setOuterPaperThickness] = useState<number[]>([]);
  const [sheetSize, setSheetSize] = useState("");
  const [sheetValue, setSheetValue] = useState("");
  const [paperSize, setPaperSize] = useState("");
  const [plateSize, setPlateSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pages, setPages] = useState("");
  const [outerpages, setOuterPages] = useState("");
  const [paperType, setPaperType] = useState<Paper[]>([]);
  const [selectedPaperType, setSelectedInnerPaper] = useState("");
  const [outerSelectedPaperType, setOuterSelectedPaperType] = useState("");
  const [selectedPaperThickness, setSelectedPaperThickness] = useState("");
  const [selectedOuterPaperThickness, setSelectedOuterPaperThickness] =
    useState("");
  const [changeCostPerKg, setChangeCostPerKg] = useState(0);
  const [laminationPrice, setLaminationPrice] = useState(0);
  const [paperPrice, setPaperPrice] = useState(0);
  const [inkPlate, setInkPlate] = useState(0);
  const [plateSizes, setPlateSizes] = useState<Plate[]>([]);
  const [outerChangeCostPerKg, setOuterChangeCostPerKg] = useState(0);
  const [bindingType, setBindingType] = useState<string[]>([]);
  const [laminationType, setLaminationType] = useState<string[]>([]);
  const [coverTreatmentType, setCoverTreatmentType] = useState<string[]>([]);
  const [packetCost, setPacketCost] = useState(0);
  const [plateCost, setPlateCost] = useState(0);
  const [inks, setInks] = useState<Ink[]>([]);
  const [coverTreatmentRate, setCoverTreatmentRate] = useState(0);
  const [inkCost, setInkCost] = useState(0);
  const [bindingCost, setBindingCost] = useState(0);
  const [selectedBindingType, setSelectedBindingType] = useState("");
  const [selectedInkType, setSelectedInkType] = useState("");
  const [selectedLaminationType, setSelectedLaminationType] = useState("");
  const [selectedCoverTreatmentType, setSelectedCoverTreatmentType] =
    useState("");
  const [paperThicknesses, setPaperThicknesses] = useState<number[]>([]);
  const [outerPaperPrice, setOuterPaperPrice] = useState(0);
  const [plateLength, setPlateLength] = useState(0);
  const [plateBreadth, setPlateBreadth] = useState(0);
  const [sheetPackage, setSheetPackage] = useState("500");
  const [innerSheetPackage, setInnerSheetPackage] = useState("500");

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        paperSizesData,
        sheetSizesData,
        papersData,
        platesData,
        bindingsData,
        laminationsData,
        inksData,
      ] = await Promise.all([
        getPaperSizes(),
        getSheetSizes(),
        getPapers(),
        getPlates(),
        getBindings(),
        getLaminations(),
        getInks(),
      ]);
      setPaperSizes(paperSizesData);
      setSheetSizes(sheetSizesData);
      setPaperTypes(papersData);
      setPaperType(papersData);
      setOuterPaperType(papersData);
      setPlateSizes(platesData);
      setBindingType(bindingsData.map((b) => b.bindingType));
      setLaminationType(laminationsData.map((l) => l.laminationType));
      setInks(inksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedBindingType) getRateForBindingType(selectedBindingType);
    if (selectedLaminationType)
      getRateForLaminationType(selectedLaminationType);
    if (selectedPaperType) getRateForPaper(selectedPaperType);
    if (outerSelectedPaperType) getRateForOuterPaper(outerSelectedPaperType);
    if (selectedOuterLaminationType)
      getRateForOuterLaminationType(selectedOuterLaminationType);
    if (plateSize) getRatePlate(plateSize);
  }, [
    selectedBindingType,
    selectedLaminationType,
    selectedCoverTreatmentType,
    selectedPaperType,
    outerSelectedPaperType,
    selectedOuterLaminationType,
    plateSize,
  ]);

  const handlePaperSizeChange = (value: string) => {
    setPaperSize(value);
    const selectedPaperSize = paperSizes.find(
      (size) => size.paperSize === value
    );
    if (selectedPaperSize) {
      setStandardLength(selectedPaperSize.paperLength.toString());
      setStandardBreadth(selectedPaperSize.paperBreadth.toString());
    }
  };

  const handlePaperTypeChange = (value: string) => {
    setSelectedInnerPaper(value);
    setSelectedPaperThickness("");
  };

  const handleOuterPaperTypeChange = (value: string) => {
    setOuterSelectedPaperType(value);
    setSelectedOuterPaperThickness("");
  };

  const handlePaperThicknessChange = (value: string) => {
    setSelectedPaperThickness(value);
  };

  const handlePaperOuterThicknessChange = (value: string) => {
    setSelectedOuterPaperThickness(value);
  };

  const handleCoverTreatmentTypeChange = (value: string) => {
    setSelectedCoverTreatmentType(value);
  };

  const handleOuterLaminationTypeChange = (value: string) => {
    setSelectedOuterLaminationType(value);
  };

  const handleSheetPackageChange = (value: string) => {
    setSheetPackage(value);
  };

  const handleInnerSheetPackageChange = (value: string) => {
    setInnerSheetPackage(value);
  };

  const getRatePlate = async (plateSize: string) => {
    try {
      const plates = await getPlates();
      const plate = plates.find((p) => p.plateSize === plateSize);
      if (plate) {
        setPlateCost(plate.plateRate);
        setInkPlate(plate.inkRate);
      }
    } catch (error) {
      console.error("Error fetching plate rate:", error);
    }
  };

  const getRateForPaper = async (selectedPaperType: string) => {
    try {
      const papers = await getPapers();
      const selectedPaper = papers.find(
        (p) => p.paperType === selectedPaperType
      );
      if (selectedPaper) {
        setPaperPrice(selectedPaper.rate);
      }
    } catch (error) {
      console.error("Error fetching paper rates:", error);
    }
  };

  const getRateForOuterPaper = async (outerSelectedPaperType: string) => {
    if (outerSelectedPaperType) {
      try {
        const papers = await getPapers();
        const outPaper = papers.find(
          (p) => p.paperType === outerSelectedPaperType
        );
        if (outPaper) {
          setOuterPaperPrice(outPaper.rate);
        }
      } catch (error) {
        console.error("Error fetching paper rates:", error);
      }
    }
  };

  const getRateForBindingType = async (selectedBindingType: string) => {
    try {
      const bindings = await getBindings();
      const selectedBinding = bindings.find(
        (b) => b.bindingType === selectedBindingType
      );
      if (selectedBinding) {
        setBindingCost(selectedBinding.rate);
      }
    } catch (error) {
      console.error("Error fetching binding types:", error);
    }
  };

  const getRateForLaminationType = async (selectedLaminationType: string) => {
    try {
      const laminations = await getLaminations();
      const selectedLamination = laminations.find(
        (l) => l.laminationType === selectedLaminationType
      );
      if (selectedLamination) {
        setLaminationPrice(selectedLamination.rate);
      }
    } catch (error) {
      console.error("Error fetching lamination types:", error);
    }
  };

  const getRateForOuterLaminationType = async (
    selectedOuterLaminationType: string
  ) => {
    try {
      const laminations = await getLaminations();
      const selectedOuterLamination = laminations.find(
        (l) => l.laminationType === selectedOuterLaminationType
      );
      if (selectedOuterLamination) {
        setOuterLaminationRate(selectedOuterLamination.rate);
      }
    } catch (error) {
      console.error("Error fetching outer lamination types:", error);
    }
  };

  const handleBindingTypeChange = (value: string) => {
    setSelectedBindingType(value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value.toString());
  };

  const handleLaminationTypeChange = (value: string) => {
    setSelectedLaminationType(value);
  };

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPages(value.toString());
  };

  const handleOuterPagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setOuterPages(value.toString());
  };

  const handlePlateSizeChange = (value: string) => {
    setPlateSize(value);
    const selectedPlate = plateSizes.find((p) => p.plateSize === value);
    if (selectedPlate) {
      setPlateLength(selectedPlate.plateLength);
      setPlateBreadth(selectedPlate.plateBreadth);
      setPlateCost(selectedPlate.plateRate);
      setInkCost(selectedPlate.inkRate);
    }
  };

  const handleInkTypeChange = (value: string) => {
    setSelectedInkType(value);
  };

  const handleSheetSizeChange = (value: string) => {
    setSheetSize(value);
    const selectedSheetSize = sheetSizes.find((s) => s.sheetSize === value);
    if (selectedSheetSize) {
      setSheetLength(selectedSheetSize.sheetLength.toString());
      setSheetBreadth(selectedSheetSize.sheetBreadth.toString());
      setSheetValue(selectedSheetSize.value.toString());
    }
  };

  const generateThicknessOptions = (selectedPaperType: string): number[] => {
    const selectedPaper = paperTypes.find(
      (paper) => paper.paperType === selectedPaperType
    );
    if (!selectedPaper) return [];

    const options: number[] = [];
    for (
      let thickness = selectedPaper.minThickness;
      thickness <= selectedPaper.maxThickness;
      thickness += 10
    ) {
      options.push(thickness);
    }
    return options;
  };

  const fitPapers = (
    sheetBreadth: number,
    sheetLength: number,
    paperBreadth: number,
    paperLength: number
  ): number => {
    const calculateFit = (sb: number, sl: number, pb: number, pl: number) => {
      const fitHorizontally = Math.floor(sb / pb);
      const fitVertically = Math.floor(sl / pl);
      return fitHorizontally * fitVertically;
    };

    const fitNormal = calculateFit(
      sheetBreadth,
      sheetLength,
      paperBreadth,
      paperLength
    );
    const fitRotated = calculateFit(
      sheetBreadth,
      sheetLength,
      paperLength,
      paperBreadth
    );
    console.log("this is the dataaaa", fitNormal, fitRotated);
    return Math.max(fitNormal, fitRotated) * 2;
  };

  const fitPlate = (
    plateBreadth: number,
    plateLength: number,
    paperBreadth: number,
    paperLength: number
  ): number => {
    console.log(
      "this is the data",
      plateBreadth,
      plateLength,
      paperBreadth,
      paperLength
    );
    const calculatePlate = (
      pb: number,
      pl: number,
      pab: number,
      pal: number
    ) => {
      const fitHorizontally = Math.floor(pb / pab);
      const fitVertically = Math.floor(pl / pal);
      return fitHorizontally * fitVertically;
    };

    const fitNormal = calculatePlate(
      plateBreadth,
      plateLength,
      paperBreadth,
      paperLength
    );
    const fitRotated = calculatePlate(
      plateBreadth,
      plateLength,
      paperLength,
      paperBreadth
    );
    return Math.max(fitNormal, fitRotated);
  };

  const totalPlate = (
    pages: number,
    plateFit: number,
    selectedInkType: string
  ): number => {
    const totalNo = Math.ceil(pages / plateFit);
    return selectedInkType === "CMYK" ? totalNo * 4 : totalNo;
  };

  const reamCalc = (
    selectedPaperThickness: number,
    sheetValue: number
  ): number => {
    const reamCalc = Math.ceil(sheetValue * selectedPaperThickness);
    console.log("this is the reamCalc", reamCalc);
    return reamCalc;
  };

  const innerPaperCost = (
    sheetValue: number,
    selectedPaperThickness: number,
    pages: number,
    quantity: number,
    paperFit: number,
    paperPrice: number,
    innerSheetPackage: string
  ): number => {
    let calc =
      ((sheetValue * selectedPaperThickness * paperPrice) / 3100) *
      totalReams(pages, quantity, paperFit);

    if (innerSheetPackage === "250") {
      calc /= 2;
    } else if (innerSheetPackage === "125") {
      calc /= 4;
    }

    return calc;
  };

  const outerFinalCost = (
    sheetValue: number,
    selectedOuterPaperThickness: number,
    paperFit: number,
    quantity: number,
    outerPaperPrice: number,
    sheetPackage: string
  ): number => {
    let calc =
      ((sheetValue * selectedOuterPaperThickness * outerPaperPrice) /
        3100 /
        2) *
      totalPacket(quantity, paperFit);

    if (sheetPackage === "250") {
      calc /= 2;
    } else if (sheetPackage === "125") {
      calc /= 4;
    }

    return calc;
  };

  const totalReams = (
    pages: number,
    quantity: number,
    paperFit: number
  ): number => {
    return Math.ceil(
      0.05 * Math.floor((pages * quantity) / paperFit / 500) +
        Math.floor((pages * quantity) / paperFit / 500)
    );
  };

  const totalPacket = (quantity: number, paperFit: number): number => {
    const sheets = (4 * quantity) / paperFit;
    const sheet = Math.ceil(sheets / 100);
    console.log("this is the final data totalpacket", sheet);
    return sheet;
  };

  const laminationFinal = (
    laminationCost: number,
    sheetLength: number,
    sheetBreadth: number,
    quantity: number
  ): number => {
    return laminationCost * (sheetLength / 2) * (sheetBreadth / 2) * quantity;
  };
  const totalSheets = (
    quantity: number,
    pages: number,
    paperFit: number
  ): number => {
    return (
      Math.round(quantity * pages) / paperFit +
      (0.05 * Math.round(quantity * pages)) / paperFit
    );
    // return Math.ceil((quantity * pages) / paperFit);
  };

  const paperFit = fitPapers(
    parseFloat(sheetBreadth),
    parseFloat(sheetLength),
    parseFloat(breadth || standardBreadth),
    parseFloat(length || standardLength)
  );

  const plateFit = fitPlate(
    plateBreadth,
    plateLength,
    parseFloat(breadth || standardBreadth),
    parseFloat(length || standardLength)
  );

  const noPlate = totalPlate(parseInt(pages), plateFit, selectedInkType);

  const pricePlate = noPlate * inkPlate;
  const pricePrint = noPlate * plateCost;

  const calculateLamination = (
    laminationPrice: number,
    sheetLength: number,
    sheetBreadth: number,
    quantity: number,
    length: number,
    breadth: number
  ): number => {
    return (
      laminationPrice *
      (sheetLength || length) *
      (sheetBreadth || breadth) *
      quantity
    );
  };

  const totalCost =
    // Math.ceil(
    //   totalPacket(parseInt(quantity), paperFit) * (reamCalc(parseInt(selectedOuterPaperThickness), parseFloat(sheetValue)) / 5)); +
    parseInt(pages) * plateCost +
    Math.ceil(bindingCost * parseInt(quantity)) +
    pricePlate +
    pricePrint +
    calculateLamination(
      laminationPrice,
      parseFloat(sheetLength),
      parseFloat(sheetBreadth),
      parseInt(quantity),
      parseInt(length),
      parseInt(breadth)
    );

  return (
    <>
      <div className="flex h-screen bg-gray-100  ">
        <div className="flex-shrink-0 ">
          <ErpSidebar />
        </div>
        <div className="cost-calc-container bg-gray-100 w-[100%] min-h-screen flex gap-[10px]">
          <div className="main-content flex-1 ml-[10px]  h-screen overflow-hidden">
            <ScrollArea>
              <Card className="shadow-lg h-screen border border-none overflow-y-auto">
                <div className="text-center p-4 mt-2 flex justify-center items-center">
                  <h1 className="text-4xl font-bold text-gray-800">
                    Cost Calculator
                  </h1>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="ml-2 h-5 w-5 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cost calculation for WordsCape</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-700">
                    Total Estimate: Rs.{Number.isNaN(totalCost) ? 0 : totalCost}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="cost-box">
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Product Specs
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="paperSize">Paper Size</Label>
                          <Select
                            onValueChange={handlePaperSizeChange}
                            value={paperSize}
                          >
                            <SelectTrigger className="w-full" id="paperSize">
                              <SelectValue placeholder="Select Paper Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {paperSizes.map((size) => (
                                <SelectItem
                                  key={size.id}
                                  value={size.paperSize}
                                >
                                  {size.paperSize}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pages">Number of Pages</Label>
                          <Input
                            id="pages"
                            type="number"
                            placeholder="Enter number of pages"
                            value={pages}
                            onChange={handlePagesChange}
                            min={8}
                            max={500}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="Enter quantity"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min={50}
                            max={10000}
                            required
                          />
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Custom Paper Detail
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="length">Length (inches)</Label>
                          <Input
                            id="length"
                            type="number"
                            placeholder="Enter length (inches)"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="breadth">Breadth (inches)</Label>
                          <Input
                            id="breadth"
                            type="number"
                            placeholder="Enter breadth (inches)"
                            value={breadth}
                            onChange={(e) => setBreadth(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="cost-box-1">
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Product Detail
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bindingType">Binding Type</Label>
                          <Select
                            onValueChange={handleBindingTypeChange}
                            value={selectedBindingType}
                          >
                            <SelectTrigger className="w-full" id="bindingType">
                              <SelectValue placeholder="Select Binding Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {bindingType.map((binding, index) => (
                                <SelectItem key={index} value={binding}>
                                  {binding}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bindingCost">
                            Binding Cost (Custom Price)
                          </Label>
                          <Input
                            id="bindingCost"
                            type="number"
                            placeholder="Binding Cost (Custom Price)"
                            value={bindingCost.toString()}
                            onChange={(e) =>
                              setBindingCost(parseFloat(e.target.value))
                            }
                            required
                          />
                        </div>
                        {/* <div className="space-y-2">
                      <Label htmlFor="coverTreatment">Cover Treatment Type</Label>
                      <Select onValueChange={handleCoverTreatmentTypeChange} value={selectedCoverTreatmentType}>
                        <SelectTrigger className="w-full" id="coverTreatment">
                          <SelectValue placeholder="Select Cover Treatment Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {coverTreatmentType.map((covertreatment, index) => (
                            <SelectItem key={index} value={covertreatment}>
                              {covertreatment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> */}
                      </div>
                    </div>

                    <div className="cost-box-m">
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Material Detail
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="innerPaperType">
                            Inner Paper Type
                          </Label>
                          <Select
                            onValueChange={handlePaperTypeChange}
                            value={selectedPaperType}
                          >
                            <SelectTrigger
                              className="w-full"
                              id="innerPaperType"
                            >
                              <SelectValue placeholder="Select Inner Paper Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {paperType.map((paper, index) => (
                                <SelectItem key={index} value={paper.paperType}>
                                  {paper.paperType.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="innerPaperThickness">
                            Inner Paper Thickness
                          </Label>
                          <Select
                            onValueChange={handlePaperThicknessChange}
                            value={selectedPaperThickness}
                          >
                            <SelectTrigger
                              className="w-full"
                              id="innerPaperThickness"
                            >
                              <SelectValue placeholder="Set Inner Paper Thickness" />
                            </SelectTrigger>
                            <SelectContent>
                              {generateThicknessOptions(selectedPaperType).map(
                                (thickness) => (
                                  <SelectItem
                                    key={thickness}
                                    value={thickness.toString()}
                                  >
                                    {thickness}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="outerPaperType">
                            Outer Paper Type
                          </Label>
                          <Select
                            onValueChange={handleOuterPaperTypeChange}
                            value={outerSelectedPaperType}
                          >
                            <SelectTrigger
                              className="w-full"
                              id="outerPaperType"
                            >
                              <SelectValue placeholder="Select Outer Paper Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {outerPaperType.map((paper, index) => (
                                <SelectItem key={index} value={paper.paperType}>
                                  {paper.paperType.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="outerPaperThickness">
                            Outer Paper Thickness
                          </Label>
                          <Select
                            onValueChange={handlePaperOuterThicknessChange}
                            value={selectedOuterPaperThickness}
                          >
                            <SelectTrigger
                              className="w-full"
                              id="outerPaperThickness"
                            >
                              <SelectValue placeholder="Set Outer Paper Thickness" />
                            </SelectTrigger>
                            <SelectContent>
                              {generateThicknessOptions(
                                outerSelectedPaperType
                              ).map((thickness) => (
                                <SelectItem
                                  key={thickness}
                                  value={thickness.toString()}
                                >
                                  {thickness}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="laminationType">
                            Lamination Type
                          </Label>
                          <Select
                            onValueChange={handleLaminationTypeChange}
                            value={selectedLaminationType}
                          >
                            <SelectTrigger
                              className="w-full"
                              id="laminationType"
                            >
                              <SelectValue placeholder="Select Lamination Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {laminationType.map((lamination, index) => (
                                <SelectItem key={index} value={lamination}>
                                  {lamination}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="cost-box-2">
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Process Detail
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plateSize">Plate Size</Label>
                          <Select
                            onValueChange={handlePlateSizeChange}
                            value={plateSize}
                          >
                            <SelectTrigger className="w-full" id="plateSize">
                              <SelectValue placeholder="Select Plate Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {plateSizes.map((size, index) => (
                                <SelectItem key={index} value={size.plateSize}>
                                  {size.plateSize}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-black font-semibold">
                          The selected plate will fit a quantity of:{" "}
                          {Number.isNaN(plateFit) ? 0 : plateFit} Papers
                        </p>
                        <p className="text-black font-semibold">
                          The selected plate will cost: Rs.{" "}
                          {Number.isNaN(pricePrint) ? 0 : pricePrint}
                        </p>
                        <p className="text-black font-semibold">
                          The selected plate with ink {selectedInkType} will
                          cost: Rs.{Number.isNaN(pricePlate) ? 0 : pricePlate}
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="sheetSize">Sheet Size</Label>
                          <Select
                            onValueChange={handleSheetSizeChange}
                            value={sheetSize}
                          >
                            <SelectTrigger className="w-full" id="sheetSize">
                              <SelectValue placeholder="Select Sheet Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {sheetSizes.map((size) => (
                                <SelectItem
                                  key={size.sheetSizeId}
                                  value={size.sheetSize}
                                >
                                  {size.sheetSize}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-black font-semibold">
                          The selected sheet will fit a quantity of:{" "}
                          {Number.isNaN(paperFit) ? 0 : paperFit} Papers
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="innerSheetPackage">
                            Inner Sheet Package
                          </Label>
                          <Select
                            onValueChange={handleInnerSheetPackageChange}
                            value={innerSheetPackage}
                          >
                            <SelectTrigger
                              className="w-full"
                              id="innerSheetPackage"
                            >
                              <SelectValue placeholder="Select Inner Sheet Package" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="500">500 Sheets</SelectItem>
                              <SelectItem value="250">250 Sheets</SelectItem>
                              <SelectItem value="125">125 Sheets</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="outerSheetPackage">
                            Outer Sheet Package
                          </Label>
                          <Select
                            onValueChange={handleSheetPackageChange}
                            value={sheetPackage}
                          >
                            <SelectTrigger
                              className="w-full"
                              id="outerSheetPackage"
                            >
                              <SelectValue placeholder="Select Outer Sheet Package" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="500">500 Sheets</SelectItem>
                              <SelectItem value="250">250 Sheets</SelectItem>
                              <SelectItem value="125">125 Sheets</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="inkType">Ink Type</Label>
                          <Select
                            onValueChange={handleInkTypeChange}
                            value={selectedInkType}
                          >
                            <SelectTrigger className="w-full" id="inkType">
                              <SelectValue placeholder="Select Ink Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {inks.map((ink) => (
                                <SelectItem key={ink.inkId} value={ink.inkType}>
                                  {ink.inkType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </ScrollArea>
          </div>

          <div className="drawer-test rounded-[20px] right-0 top-0 h-full w-[33%] shadow-lg overflow-y-auto transition-transform transform translate-x-0">
            <DrawerTest
              pages={pages}
              length={length}
              breadth={breadth}
              standardLength={standardLength}
              standardBreadth={standardBreadth}
              sheetValue={sheetValue}
              sheetLength={sheetLength}
              sheetBreadth={sheetBreadth}
              sheetSize={sheetSize}
              paperSize={paperSize}
              selectedPaperType={selectedPaperType}
              selectedPaperThickness={selectedPaperThickness}
              selectedOuterPaperThickness={selectedOuterPaperThickness}
              totalReams={totalReams(
                parseInt(pages),
                parseInt(quantity),
                paperFit
              )}
              selectedBindingType={selectedBindingType}
              outerSelectedPaperType={outerSelectedPaperType}
              plateLength={plateLength}
              plateBreadth={plateBreadth}
              plateSize={plateSize}
              selectedLaminationType={selectedLaminationType}
              changeCostPerKg={paperPrice}
              selectedInkType={selectedInkType}
              plateCost={plateCost}
              laminationCost={laminationPrice}
              bindingCost={bindingCost}
              outerPaperPrice={outerPaperPrice}
              totalCost={totalCost}
              noPlate={noPlate}
              requiredSheet={totalSheets(
                parseInt(quantity),
                parseInt(pages),
                paperFit
              )}
              paperFit={paperFit}
              totalPacket={totalPacket(parseInt(quantity), paperFit)}
              selectedOuterLaminationType={selectedOuterLaminationType}
              outerLaminationRate={outerLaminationRate}
              innerPageCost={innerPaperCost(
                parseFloat(sheetValue),
                parseInt(selectedPaperThickness),
                parseInt(pages),
                parseInt(quantity),
                paperFit,
                paperPrice,
                innerSheetPackage
              )}
              outerPageCost={outerFinalCost(
                parseFloat(sheetValue),
                parseInt(selectedOuterPaperThickness),
                paperFit,
                parseInt(quantity),
                outerPaperPrice,
                sheetPackage
              )}
              costLamination={laminationFinal(
                laminationPrice,
                parseFloat(sheetLength),
                parseFloat(sheetBreadth),
                parseInt(quantity)
              )}
              bindingFinalCost={bindingCost * parseInt(quantity)}
              pricePrint={pricePrint}
              pricePlate={pricePlate}
              totalSheets={totalSheets(
                parseInt(quantity),
                parseInt(pages),
                paperFit
              )}
              costReam={reamCalc(
                parseInt(selectedPaperThickness),
                parseFloat(sheetValue)
              )}
              outerLamination={outerLaminationRate}
              inkCost={inkCost}
            />
          </div>
        </div>
      </div>
    </>
  );
}
