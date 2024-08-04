'use client'

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCheck } from "react-icons/fa";

interface DeliveryDetailProps {
  data: any;
  onChildData: (value: boolean) => void;
  onSave: () => void;
}

export default function DeliveryDetail({ data, onChildData, onSave }: DeliveryDetailProps) {
  
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      deliveryDetail: {
        deliveryId: 0,
        company: "",
        venue: "",
        contactPersonName: "",
        contactPersonNumber: "",
      },
    },
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let deliveryData = Cookies.get("deliveryData");
    if (deliveryData != null) {
      let datas = JSON.parse(deliveryData);
      if(datas.deliveryDetail != null){
      setValue("deliveryDetail.company", datas.deliveryDetail.company);
      setValue("deliveryDetail.venue", datas.deliveryDetail.venue);
      setValue("deliveryDetail.contactPersonName", datas.deliveryDetail.contactPersonName);
      setValue("deliveryDetail.contactPersonNumber", datas.deliveryDetail.contactPersonNumber);
    }
  }
  }, []);

  const onSubmit = async (formData: any) => {
    console.log(formData);
    let jsonData = {
      deliveryDetail: {
        company: formData.deliveryDetail.company,
        venue: formData.deliveryDetail.venue,
        contactPersonName: formData.deliveryDetail.contactPersonName,
        contactPersonNumber: formData.deliveryDetail.contactPersonNumber,
      },
    };
    
    // if (formData.deliveryDetail.deliveryId) {
    //   jsonData.deliveryDetail.deliveryId = formData.deliveryDetail.deliveryId;
    // }    

    console.log("json data from delivery: ", jsonData);
    Cookies.set("deliveryData", JSON.stringify(jsonData));
    onChildData(false);
    setIsSaved(true);
    onSave();
  };



  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Delivery Details</h2>
      <p className="mb-4 text-center">If to be sent to, fill below:</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input
              id="company"
              className="col-span-2"
              {...register("deliveryDetail.company")}
              placeholder="Company Name"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="venue" className="text-right">
              Venue
            </Label>
            <Input
              id="venue"
              className="col-span-2"
              {...register("deliveryDetail.venue")}
              placeholder="Venue Name"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="contactPersonName" className="text-right">
              Contact Person Name
            </Label>
            <Input
              id="contactPersonName"
              className="col-span-2"
              {...register("deliveryDetail.contactPersonName")}
              placeholder="Contact Person Name"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="contactPersonNumber" className="text-right">
              Contact Person Number
            </Label>
            <Input
              id="contactPersonNumber"
              type="number"
              className="col-span-2"
              {...register("deliveryDetail.contactPersonNumber")}
              placeholder="Contact Person Number"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit">{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
        </div>
      </form>
    </div>
  );
}