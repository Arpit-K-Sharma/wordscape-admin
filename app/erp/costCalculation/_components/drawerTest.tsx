import React from "react";
import { Separator } from "@/components/ui/separator"

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
      <div className="drawer-content flex justify-center">
      </div>
      <div className="drawer-side">
        <ul className="menu p-4 min-h-full text-gray-800">
          <li>
            <h1 className="text-3xl font-bold mt-5 mb-5 text-archivo">Cost Breakdown</h1>
            <Separator className="my-6" />
            <h3 className="text-2xl font-semibold ">Paper</h3>
            <p>Total Number of Pages: <b>{pages}</b></p>
            <p>Paper size: <b>{paperSize}</b></p>
            <p>Paper size's length: <b>{standardLength}</b></p>
            <p>Paper size's breadth <b>{standardBreadth}</b></p>
            <p>Custom Paper's Length <b>{length}</b></p>
            <p>Custom Paper's Breadth <b>{breadth}</b></p>
            <p>Inner type: <b>{selectedPaperType}</b></p>
            <p>Unit cost for paper type (per kg): Rs. <b>{changeCostPerKg}</b></p>
            <p>Inner paper thickness: <b>{selectedPaperThickness}</b> gsm</p>
            <p>Total Sheets: <b>{totalReams * 500}</b></p>
            <p>Total Reams: <b>{totalReams}</b></p>
          </li>
          <Separator className="my-6" />
          <li>
            <h3 className="text-2xl font-semibold mt-4">Cover Paper</h3>
            <p>Cover paper type: <b>{outerSelectedPaperType}</b></p>
            <p>Cost for outer paper type (per kg): Rs. <b>{outerPaperPrice}</b></p>
            <p>Cover paper thickness: <b>{selectedOuterPaperThickness} gsm</b></p>
            <p>Total packet: <b>{totalPacket}</b></p>
          </li>
          <Separator className="my-6" />
          <li>
            <h3 className="text-2xl font-semibold mt-4">Plate Details</h3>
            <p>Chosen plate size: <b>{plateSize}</b></p>
            <p>Plate Length: <b>{plateLength}</b></p>
            <p>Plate Length: <b>{plateBreadth}</b></p>
            <p>Number of Plates: <b>{noPlate}</b></p>
            <p>Ink Details: <b>{selectedInkType}</b></p>
          </li>
          <Separator className="my-6" />
          <li>
            <h3 className="text-2xl font-semibold mt-4">Sheet Details</h3>
            <p>Chosen sheet size: <b>{sheetSize}</b></p>
            <p>Value of sheet size: <b>{sheetValue}</b></p>
            <p>Length of sheet size: <b>{sheetLength || length}</b></p>
            <p>Breadth of sheet size: <b>{sheetBreadth || breadth}</b></p>
            <p>Sheet can contain: <b>{paperFit} Pages</b></p>
            <p>Total number of sheets for inner pages: <b>{requiredSheet}</b></p>
          </li>
          <Separator className="my-6" />
          <li>
            <h3 className="text-2xl font-semibold mt-4">Binding</h3>
            <p>Selected binding type: <b>{selectedBindingType}</b></p>
            <p>Cost of binding: Rs. <b>{bindingCost}</b></p>
          </li>
          <Separator className="my-6" />
          <li>
            <h3 className="text-2xl font-semibold mt-4">Lamination</h3>
            <p>Type of Inner Lamination: <b>{selectedLaminationType}</b></p>
            <p>Cost of Inner Lamination: Rs. <b>{laminationCost}</b></p>
          </li>
          <Separator className="my-6" />
          <li>
            <h3 className="text-3xl font-semibold mt-4">Total Cost</h3>
            <p>The cost of inner paper is Rs. <b>{Math.floor(innerPageCost)}</b></p>
            <p>The cost of outer paper is Rs. <b>{Math.floor(outerPageCost)}</b></p>
            <p>The cost of lamination is Rs. <b>{Math.floor(costLamination)}</b></p>
            <p>The cost of binding is Rs.<b>{Math.floor(bindingFinalCost)}</b></p>
            <p>The cost of printing on a plate is Rs.<b>{Math.floor(pricePrint)}</b></p>
            <p>The cost of a plate with the selected ink is Rs.<b>{Math.floor(pricePlate)}</b></p>
            <p>Total Cost: Rs. <b>{totalCost}</b></p>
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default DrawerTest;
