'use client'

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FaCheck } from "react-icons/fa";

interface PaymentTableProps {
  data?: {
    paymentMethod?: string;
    serviceRequired?: string[];
    prePressUnitId?: number;
  };
  onChildData: (open: boolean) => void;
  onSave: () => void;
}

interface FormData {
  servicePaymentList: {
    prePressUnitId: number;
    paymentWay: string;
    serviceRequired: string[];
  };
}

export default function PaymentTable({ onChildData, onSave }: PaymentTableProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      servicePaymentList: {
        prePressUnitId: 0,
        paymentWay: "",
        serviceRequired: [],
      },
    },
  });

  useEffect(() => {
    const paymentData = Cookies.get("paymentData");
    if (paymentData) {
      try {
        const data = JSON.parse(paymentData);
        if (data && data.servicePaymentList) {
          setValue("servicePaymentList.paymentWay", data.servicePaymentList.paymentMethod || "");
          setValue("servicePaymentList.serviceRequired", data.servicePaymentList.serviceRequired || []);
        }
      } catch (error) {
        console.error("Error parsing payment data:", error);
      }
    }
  }, [setValue]);
  
  const onSubmit = (formData: FormData) => {

    let jsonData = {}
    if(formData.servicePaymentList.prePressUnitId == 0){
       jsonData = {
        servicePaymentList: {
        paymentMethod: formData.servicePaymentList.paymentWay,
        serviceRequired: formData.servicePaymentList.serviceRequired
      },
    };
  }
  else{
      jsonData = {
        servicePaymentList: {
          paymentMethod: formData.servicePaymentList.paymentWay,
          serviceRequired: formData.servicePaymentList.serviceRequired,
          prePressUnitId: formData.servicePaymentList.prePressUnitId
        }
      }
    }
    console.log("json data from payment table tsx: ", jsonData);
    Cookies.set("paymentData", JSON.stringify(jsonData));
    onSave();
    onChildData(false);
    setIsSaved(true);
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Payment & Services</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[40px] mt-8">
          <h3 className="text-xl text-center font-bold mb-[20px]">Payment Method</h3>
          <Controller
            name="servicePaymentList.paymentWay"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex justify-center gap-[60px]"
                value={field.value}
                onValueChange={field.onChange}
              >
                {["Advance", "On Delivery", "Credit"].map((method) => (
                  <div key={method} className="flex items-center space-x-4">
                    <RadioGroupItem value={method} id={method.toLowerCase().replace(' ', '-')} className="w-6 h-6 " />
                    <Label htmlFor={method.toLowerCase().replace(' ', '-')}>{method}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <div className="mb-6 mt-8">
          <h3 className="text-xl text-center font-bold mb-[20px]">Service Required</h3>
          <div className="flex justify-center gap-[60px]">
            {["Pre Press", "Press", "Post-press"].map((service) => (
              <div key={service} className="flex items-center space-x-3 ">
                <Controller
                  name="servicePaymentList.serviceRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={service}
                      className="w-5 h-5 "
                      checked={field.value.includes(service)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, service]);
                        } else {
                          field.onChange(field.value.filter((item: string) => item !== service));
                        }
                      }}
                    />
                  )}
                />
                <Label htmlFor={service}>{service}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
        </div>
      </form>
    </div>
  );
}
