'use client'

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaCheck } from "react-icons/fa";

interface CostbreakdownProps {
  data: any;
  onChildData: (value: boolean) => void;
  onSave: () => void;
}

interface CostCalculation {
  costCalculationId?: number;
  plates: number;
  printing: number;
  paper: number;
  coverPaper: number;
  innerPaper: number;
  otherPaper: number;
  lamination: number;
  binding: number;
  finishing: number;
  extraCharges: number;
  deliveryCharges: number;
  subTotal: number;
  vat: number;
  grandTotal: number;
  preparedBy: string;
  approvedBy: string;
  billingInfo: {
    approvalStatus: string;
    invoiceIssueDate: string;
    invoiceNo: string;
    customerName: string;
    issuedBy: string;
  };
}

export default function Costbreakdown({ data, onChildData, onSave}: CostbreakdownProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [costCalculation, setCostCalculation] = useState<CostCalculation>({
    plates: 0,
    printing: 0,
    paper: 0,
    coverPaper: 0,
    innerPaper: 0,
    otherPaper: 0,
    lamination: 0,
    binding: 0,
    finishing: 0,
    extraCharges: 0,
    deliveryCharges: 0,
    subTotal: 0,
    vat: 0,
    grandTotal: 0,
    preparedBy: "",
    approvedBy: "",
    billingInfo: {
      approvalStatus: "",
      invoiceIssueDate: "",
      invoiceNo: "",
      customerName: "",
      issuedBy: "",
    },
  });

  useEffect(() => {
    let costCalculationData = Cookies.get("costCalculation");
    // if (costCalculationData != null ) {
    //   let data = JSON.parse(costCalculationData);
    //   if(data.costCalculation != null){
    //     setCostCalculation(data.costCalculation);
    //   }
    // }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setCostCalculation((prevState) => ({
        ...prevState,
        billingInfo: {
          ...prevState.billingInfo,
          approvalStatus: value,
        },
      }));
    } else {
      let parsedValue: string | number = value;

      if (["preparedBy", "approvedBy"].includes(name)) {
        setCostCalculation((prevState) => ({
          ...prevState,
          [name]: parsedValue.toString().trim(),
        }));
      } else if (["grandTotal", "subTotal", "vat"].includes(name)) {
        setCostCalculation((prevState) => ({
          ...prevState,
          [name]: parseFloat(parsedValue.toString()),
        }));
      } else if (
        ["invoiceIssueDate", "invoiceNo", "customerName", "issuedBy"].includes(
          name
        )
      ) {
        setCostCalculation((prevState) => ({
          ...prevState,
          billingInfo: {
            ...prevState.billingInfo,
            [name]: parsedValue.toString().trim(),
          },
        }));
      } else {
        setCostCalculation((prevState) => ({
          ...prevState,
          [name]: parseFloat(parsedValue.toString()),
        }));
      }
    }
  };

  const handleSave = () => {
    const dataToSave = {
      ...costCalculation,
    };

    Cookies.set("costCalculation", JSON.stringify(dataToSave));
    console.log("Cost Calc " , dataToSave);
    onSave();
    onChildData(false);
    setIsSaved(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow overflow-y-auto max-h-[85vh]">
      <h2 className="text-2xl font-bold mb-6 text-center">Cost Calculation</h2>
      <div className="grid gap-4 mb-6">
        {Object.entries(costCalculation).map(([key, value]) => {
          if (key !== "billingInfo" && key !== "costCalculationId") {
            return (
              <div key={key} className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor={key} className="text-right">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input
                  id={key}
                  type={typeof value === 'number' ? 'number' : 'text'}
                  value={value}
                  onChange={handleChange}
                  name={key}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="grid gap-4 mb-6">
        <div className="grid grid-cols-2 items-center gap-4">
          <Label htmlFor="invoiceIssueDate" className="text-right">
            Invoice Issue Date
          </Label>
          <Input
            id="invoiceIssueDate"
            type="date"
            value={costCalculation.billingInfo.invoiceIssueDate}
            onChange={handleChange}
            name="invoiceIssueDate"
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <Label htmlFor="invoiceNo" className="text-right">
            Invoice No.
          </Label>
          <Input
            id="invoiceNo"
            value={costCalculation.billingInfo.invoiceNo}
            onChange={handleChange}
            name="invoiceNo"
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <Label className="text-right">Approval Status</Label>
          <RadioGroup
            value={costCalculation.billingInfo.approvalStatus}
            onValueChange={(value) =>
              setCostCalculation((prevState) => ({
                ...prevState,
                billingInfo: {
                  ...prevState.billingInfo,
                  approvalStatus: value,
                },
              }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="required" id="required" />
              <Label htmlFor="required">Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="approved" id="approved" />
              <Label htmlFor="approved">Approved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reviseneeded" id="reviseneeded" />
              <Label htmlFor="reviseneeded">Revise needed</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <Label htmlFor="customerName" className="text-right">
            Customer Name
          </Label>
          <Input
            id="customerName"
            value={costCalculation.billingInfo.customerName}
            onChange={handleChange}
            name="customerName"
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <Label htmlFor="issuedBy" className="text-right">
            Issued By
          </Label>
          <Input
            id="issuedBy"
            value={costCalculation.billingInfo.issuedBy}
            onChange={handleChange}
            name="issuedBy"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
      </div>
    </div>
  );
}