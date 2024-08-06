import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Layers,
  Printer,
  Scissors,
  Book,
  PaintBucket,
  DollarSign,
  Percent,
} from "lucide-react";

const renderValue = (value: number | string) => {
  return isNaN(Number(value)) ? "" : value;
};

const DrawerTest = ({
  paperSize,
  pages,
  selectedPaperType,
  selectedPaperThickness,
  requiredSheet,
  bindingCost,
  plateLength,
  plateBreadth,
  noPlate,
  sheetLength,
  paperFit,
  sheetBreadth,
  outerPageCost,
  totalReams,
  outerPaperPrice,
  standardLength,
  standardBreadth,
  bindingFinalCost,
  outerLaminationRate,
  selectedOuterLaminationType,
  totalSheets,
  innerPageCost,
  pricePrint,
  pricePlate,
  plateCost,
  length,
  costLamination,
  breadth,
  costReam,
  sheetValue,
  outerLamination,
  sheetSize,
  changeCostPerKg,
  outerSelectedPaperType,
  selectedOuterPaperThickness,
  totalPacket,
  plateSize,
  selectedInkType,
  inkCost,
  totalCost,
  selectedBindingType,
  selectedLaminationType,
  laminationCost,
}) => {
  return (
    <div className="drawer  drawer-end bg-[#fcfcff]">
      <div className="drawer-content flex justify-center"></div>
      <div className="drawer-side">
        <ul className="menu p-4 min-h-full text-gray-800">
          <li>
            <h1 className="text-3xl font-bold mt-[13px] mb-6 text-archivo flex items-center">
              <DollarSign className="mr-2" />
              Cost Breakdown
            </h1>
            <Separator className="my-4" />
            <h3 className="text-2xl font-semibold flex items-center">
              <FileText className="mr-2" />
              Paper
            </h3>
            <div className="ml-6 space-y-2 mt-2">
              <p>
                Total Number of Pages: <b>{pages}</b>
              </p>
              <p>
                Paper size: <b>{paperSize}</b>
              </p>
              <p>
                Paper size's length: <b>{standardLength}</b>
              </p>
              <p>
                Paper size's breadth <b>{standardBreadth}</b>
              </p>
              <p>
                Custom Paper's Length <b>{length}</b>
              </p>
              <p>
                Custom Paper's Breadth <b>{breadth}</b>
              </p>
              <p>
                Inner type: <b>{selectedPaperType}</b>
              </p>
              <p>
                Unit cost for paper type (per kg): Rs. <b>{changeCostPerKg}</b>
              </p>
              <p>
                Inner paper thickness: <b>{selectedPaperThickness}</b> gsm
              </p>
              <p>
                Total Sheets: <b>{renderValue(totalReams * 500)}</b>
              </p>
              <p>
                Total Reams: <b>{renderValue(totalReams)}</b>
              </p>
            </div>
          </li>
          <Separator className="my-4" />
          <li>
            <h3 className="text-2xl font-semibold mt-4 flex items-center">
              <Book className="mr-2" />
              Cover Paper
            </h3>
            <div className="ml-6 space-y-2 mt-2">
              <p>
                Cover paper type: <b>{outerSelectedPaperType}</b>
              </p>
              <p>
                Cost for outer paper type (per kg): Rs. <b>{outerPaperPrice}</b>
              </p>
              <p>
                Cover paper thickness: <b>{selectedOuterPaperThickness} gsm</b>
              </p>
              <p>
                Total packet: <b>{renderValue(totalPacket)}</b>
              </p>
            </div>
          </li>
          <Separator className="my-4" />
          <li>
            <h3 className="text-2xl font-semibold mt-4 flex items-center">
              <Printer className="mr-2" />
              Plate Details
            </h3>
            <div className="ml-6 space-y-2 mt-2">
              <p>
                Chosen plate size: <b>{plateSize}</b>
              </p>
              <p>
                Plate Length: <b>{plateLength}</b>
              </p>
              <p>
                Plate Length: <b>{plateBreadth}</b>
              </p>
              <p>
                Number of Plates: <b>{renderValue(noPlate)}</b>
              </p>
              <p>
                Ink Details: <b>{selectedInkType}</b>
              </p>
            </div>
          </li>
          <Separator className="my-4" />
          <li>
            <h3 className="text-2xl font-semibold mt-4 flex items-center">
              <Layers className="mr-2" />
              Sheet Details
            </h3>
            <div className="ml-6 space-y-2 mt-2">
              <p>
                Chosen sheet size: <b>{sheetSize}</b>
              </p>
              <p>
                Value of sheet size: <b>{sheetValue}</b>
              </p>
              <p>
                Length of sheet size: <b>{sheetLength || length}</b>
              </p>
              <p>
                Breadth of sheet size: <b>{sheetBreadth || breadth}</b>
              </p>
              <p>
                Sheet can contain: <b>{renderValue(paperFit)} Pages</b>
              </p>
              <p>
                Total number of sheets for inner pages:{" "}
                <b>{renderValue(requiredSheet)}</b>
              </p>
            </div>
          </li>
          <Separator className="my-4" />
          <li>
            <h3 className="text-2xl font-semibold mt-4 flex items-center">
              <Scissors className="mr-2" />
              Binding
            </h3>
            <div className="ml-6 space-y-2 mt-2">
              <p>
                Selected binding type: <b>{selectedBindingType}</b>
              </p>
              <p>
                Cost of binding: Rs. <b>{renderValue(bindingCost)}</b>
              </p>
            </div>
          </li>
          <Separator className="my-4" />
          <li>
            <h3 className="text-2xl font-semibold mt-4 flex items-center">
              <PaintBucket className="mr-2" />
              Lamination
            </h3>
            <div className="ml-6 space-y-2 mt-2">
              <p>
                Type of Inner Lamination: <b>{selectedLaminationType}</b>
              </p>
              <p>
                Cost of Inner Lamination: Rs.{" "}
                <b>{renderValue(laminationCost)}</b>
              </p>
            </div>
          </li>
          <Separator className="my-4" />
          <li>
            <h3 className="text-3xl font-semibold mt-4 flex items-center">
              <DollarSign className="mr-2" />
              Total Cost
            </h3>
            <div className="ml-6 space-y-2 mt-2">
              <p>
                The cost of inner paper is Rs.{" "}
                <b>{renderValue(Math.floor(innerPageCost))}</b>
              </p>
              <p>
                The cost of outer paper is Rs.{" "}
                <b>{renderValue(Math.floor(outerPageCost) * totalPacket)}</b>
              </p>
              <p>
                The cost of lamination is Rs.{" "}
                <b>{renderValue(Math.floor(costLamination))}</b>
              </p>
              <p>
                The cost of binding is Rs.
                <b>{renderValue(Math.floor(bindingFinalCost))}</b>
              </p>
              <p>
                The cost of printing on a plate is Rs.
                <b>{renderValue(Math.floor(pricePrint))}</b>
              </p>
              <p>
                The cost of a plate with the selected ink is Rs.
                <b>{renderValue(Math.floor(pricePlate))}</b>
              </p>
              <p>
                Total Cost (Excluding Vat): Rs.{" "}
                <b>
                  {renderValue(
                    Math.floor(innerPageCost) +
                      Math.floor(outerPageCost) * totalPacket +
                      Math.floor(costLamination) +
                      Math.floor(bindingFinalCost) +
                      Math.floor(pricePrint) +
                      Math.floor(pricePlate)
                  )}
                </b>
              </p>
            </div>
          </li>
          <Separator className="my-4" />
          <h3 className="text-2xl font-semibold mt-4 flex items-center">
            <Percent className="mr-2" />
            Total (with 20% margin):
          </h3>
          <p className="text-xl font-bold ml-6 mt-2">
            Rs.{" "}
            {renderValue(
              Math.floor(
                (Math.floor(innerPageCost) +
                  Math.floor(outerPageCost) * totalPacket +
                  Math.floor(costLamination) +
                  Math.floor(bindingFinalCost) +
                  Math.floor(pricePrint) +
                  Math.floor(pricePlate)) *
                  1.2
              )
            )}
          </p>
        </ul>
      </div>
    </div>
  );
};

export default DrawerTest;
