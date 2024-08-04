'use client'

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaCheck } from "react-icons/fa";

interface PressUnitProps {
  data: any;
  onChildData: (value: boolean) => void;
  onSave: () => void;
}

interface FormData {
  prePressUnitList: {
    paymentMethod: string;
    materialReceived: string;
    flapSize: string;
    prePressDataId: number;
  };
}

export default function PressUnit({ data, onChildData, onSave }: PressUnitProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      prePressUnitList: {
        paymentMethod: "",
        materialReceived: "",
        flapSize: "",
        prePressDataId: 0,
      },
    },
  });

  useEffect(() => {
    let prePressData = Cookies.get("prePressData");
    if (prePressData != null) {
      let datas = JSON.parse(prePressData);
      if(datas.prePressUnitList != null){
        setValue("prePressUnitList.paymentMethod", datas.prePressUnitList.paymentMethod);
        setValue("prePressUnitList.materialReceived", datas.prePressUnitList.materialReceived);
        setValue("prePressUnitList.flapSize", datas.prePressUnitList.flapSize);
      }
    }
  }, []);

  const onSubmit = async (formData: FormData) => {
    console.log(formData);
    const jsonData = {
      prePressUnitList: {
        paymentMethod: formData.prePressUnitList.paymentMethod,
        materialReceived: formData.prePressUnitList.materialReceived,
        flapSize: formData.prePressUnitList.flapSize,
      },
    };

    console.log("json data from prepress unit: ", jsonData);
    Cookies.set("prePressData", JSON.stringify(jsonData));
    onChildData(false);
    onSave();
    setIsSaved(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Pre Press Unit</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <Controller
            name="prePressUnitList.paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PS/PDF" id="ps-pdf" />
                  <Label htmlFor="ps-pdf">PS/PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Original Document File" id="original-doc" />
                  <Label htmlFor="original-doc">Original Document File</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Material Received</h3>
          <Controller
            name="prePressUnitList.materialReceived"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-wrap space-x-4"
              >
                {["Dummy", "CD/DVD", "Flash Drive", "Email"].map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value.toLowerCase().replace(/\s+/g, '-')} />
                    <Label htmlFor={value.toLowerCase().replace(/\s+/g, '-')}>{value}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Imposition</h3>
          <Label htmlFor="flap-size">Flap Size</Label>
          <Controller
            name="prePressUnitList.flapSize"
            control={control}
            render={({ field }) => (
              <Input
                id="flap-size"
                type="number"
                placeholder="Flap Size"
                {...field}
              />
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
        </div>
      </form>
    </div>
  );
}