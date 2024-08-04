'use client'

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaCheck } from "react-icons/fa";

interface PlateDetailProps {
  data: PlateDetailData;
  onChildData: (open: boolean) => void;
  onSave: () => void;
}

interface PlateDetailData {
  screenType: string;
  plateData: PlateData[];
  plateDamage: string;
  plateRemake: string;
  plateDetailDataId?: number;
}

interface PlateData {
  size: string;
  colour1: string;
  colour2: string;
  colour3: string;
  colour4: string;
  special: string;
  total: string;
}

export default function PlateDetail({ data, onChildData, onSave }: PlateDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const platenumber = [1, 2, 3, 4];

  const { register, handleSubmit, setValue, control } = useForm<PlateDetailData>({
    defaultValues: {
      screenType: "",
      plateData: Array(4).fill({
        size: "",
        colour1: "",
        colour2: "",
        colour3: "",
        colour4: "",
        special: "",
        total: "",
      }),
      plateDamage: "",
      plateRemake: "",
      plateDetailDataId: 0
    },
  });

  useEffect(() => {
    let plateData = Cookies.get("plateData");
    if (plateData != null) {
      let datas = JSON.parse(plateData);
      if (datas.plateDetailData != null) {
        setValue("screenType", datas.plateDetailData.screenType);
        setValue("plateDamage", datas.plateDetailData.plateDamage);
        setValue("plateRemake", datas.plateDetailData.plateRemake);
        setValue("plateData", datas.plateDetailData.plateData);
      }
    }

  }, []);

  const onSubmit = (formData: PlateDetailData) => {
    let jsonData = {
      plateDetailData: {
        screenType: formData.screenType,
        plateData: formData.plateData,
        plateDamage: formData.plateDamage,
        plateRemake: formData.plateRemake,
      }
    };

    Cookies.set("plateData", JSON.stringify(jsonData));
    console.log("Plate Data from Plate Details: ", jsonData);
    onChildData(false);
    onSave();
    setIsSaved(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll("input");
      const currentIndex = Array.from(inputs).findIndex(
        (input) => document.activeElement === input
      );
      const nextIndex = currentIndex + 1;
      if (nextIndex < inputs.length) {
        (inputs[nextIndex] as HTMLInputElement).focus();
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Plate Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="screenType">Screen Type</Label>
          <Input
            id="screenType"
            placeholder="Screen Type"
            {...register("screenType")}
            onKeyDown={handleKeyPress}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sn</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>1 color</TableHead>
              <TableHead>2 color</TableHead>
              <TableHead>3 color</TableHead>
              <TableHead>4 color</TableHead>
              <TableHead>Special</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platenumber.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                {['size', 'colour1', 'colour2', 'colour3', 'colour4', 'special', 'total'].map((field) => (
                  <TableCell key={field}>
                    <Input
                      {...register(`plateData.${index}.${field}` as `plateData.${number}.${keyof PlateData}`)}
                      onKeyDown={handleKeyPress}
                      className="w-full"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="space-y-2">
          <Label>Plate damage:</Label>
          <Controller
            name="plateDamage"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onCTP" id="onCTP" />
                  <Label htmlFor="onCTP">on CTP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onPress" id="onPress" />
                  <Label htmlFor="onPress">on Press</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        <div>
          <Label htmlFor="plateRemake">No. of plate remake:</Label>
          <Input
            id="plateRemake"
            type="number"
            {...register("plateRemake")}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
        </div>
      </form>
    </div>
  );
}