'use client'

import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Cookies from "js-cookie";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaCheck } from "react-icons/fa";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface PressUnitsProps {
  data: any;
  onChildData: (value: boolean) => void;
  onSave: () => void;
}

interface PressData {
  pressDataId?: string;
  paperType: string;
  size: string;
  signature: string;
  ordered: string;
  produced: string;
}

interface FormData {
  totalset: string;
  forma: string;
  workandturn: string;
  pressUnitDataId: string;
  pressData: PressData[];
}

export default function PressUnits({ data, onChildData, onSave }: PressUnitsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { register, handleSubmit, reset, control, setValue } = useForm<FormData>({
    defaultValues: {
      totalset: "",
      forma: "",
      workandturn: "",
      pressUnitDataId: "",
      pressData: [
        { paperType: "", size: "", signature: "", ordered: "", produced: "" },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "pressData",
  });

  useEffect(() => {
    let pressData = Cookies.get("pressUnitData");
    if (pressData != null) {
      let datas = JSON.parse(pressData);
      if(datas.pressUnitData != null){
      setValue("totalset", datas.pressUnitData.totalSet);
      setValue("forma", datas.pressUnitData.forma);
      setValue("workandturn", datas.pressUnitData.workAndTurn);
      setValue("pressUnitDataId", datas.pressUnitData.pressUnitDataId);
      setValue("pressData", datas.pressUnitData.pressData);
    }
  }
  }, []);

  const onSubmit = async (formData: FormData) => {
    const processedPressData = formData.pressData.map((entry) => {
      const processedEntry: Partial<PressData> = {};
      Object.entries(entry).forEach(([key, value]) => {
        processedEntry[key as keyof PressData] = value ? value : null;
      });
      return processedEntry;
    });

    let jsonData = {
      pressUnitData: {
        totalSet: formData.totalset,
        forma: formData.forma,
      workAndTurn: formData.workandturn,
      pressData: processedPressData,
      }
    };

    onChildData(false);
    onSave();
    setIsSaved(true);
    Cookies.set("pressUnitData", JSON.stringify(jsonData));
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

  const handleAddRow = () => {
    append({ paperType: "", size: "", signature: "", ordered: "", produced: "" });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow overflow-y-auto max-h-[85vh]">
      <h2 className="text-2xl font-bold mb-6 text-center">Press Unit</h2>
      <ScrollArea>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="totalset">Total Set:</Label>
          <Input
            id="totalset"
            {...register("totalset")}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="forma">Forma:</Label>
            <Input
              id="forma"
              {...register("forma")}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div>
            <Label htmlFor="workandturn">Work and Turn:</Label>
            <Input
              id="workandturn"
              {...register("workandturn")}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paper Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Signature</TableHead>
              <TableHead>Ordered</TableHead>
              <TableHead>Produced</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Input
                    {...register(`pressData.${index}.paperType`)}
                    onKeyDown={handleKeyPress}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    {...register(`pressData.${index}.size`)}
                    onKeyDown={handleKeyPress}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    {...register(`pressData.${index}.signature`)}
                    onKeyDown={handleKeyPress}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    {...register(`pressData.${index}.ordered`)}
                    onKeyDown={handleKeyPress}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    {...register(`pressData.${index}.produced`)}
                    onKeyDown={handleKeyPress}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={handleAddRow}>
            <MdAdd size={24} className="text-green-500" /> Add Row
          </Button>
        </div>
        <div className="flex justify-end">
          <Button type="submit">{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
        </div>
      </form>
      </ScrollArea>
    </div>
  );
}