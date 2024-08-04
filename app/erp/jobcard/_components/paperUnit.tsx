'use client'

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { FaCheck } from "react-icons/fa";

interface PaperUnitProps {
  data: PaperUnitData;
  onChildData: (open: boolean) => void;
  onSave: () => void;
}

interface PaperUnitData {
  paperDataId: number;
  paperData0: {
    readyBy: string;
    date: string;
    time: string;
    type: string;
    size: string;
    numberOfPages: string;
    printrun: string;
    side: string[];
  };
  paperData1: PaperData1[];
  paperData2: PaperData2[];
  paperData3: PaperData3[];
}

interface PaperData1 {
  type: string;
  fullSheetSize: string;
  weight: string;
  paperType: string;
  totalSheets: string;
}

interface PaperData2 {
  type: string;
  cutSheetSize: string;
  wastage: string;
  totalCutSheet: string;
}

interface PaperData3 {
  ptype: string;
  type: string;
  gsm: string;
  printColor: string;
  lamination: string;
}

export default function PaperUnit({ data, onChildData, onSave }: PaperUnitProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { handleSubmit, control, getValues, setValue, reset, watch } = useForm<PaperUnitData>({
    defaultValues: {
      paperDataId: 0,
      paperData0: {
        readyBy: "",
        date: "",
        time: "",
        type: "",
        size: "",
        numberOfPages: "",
        printrun: "",
        side: [],
      },
      paperData1: [
        {
          type: "Paper",
          fullSheetSize: "",
          weight: "",
          paperType: "",
          totalSheets: "",
        },
        {
          type: "Cover Paper",
          fullSheetSize: "",
          weight: "",
          paperType: "",
          totalSheets: "",
        },
        {
          type: "Inner Paper",
          fullSheetSize: "",
          weight: "",
          paperType: "",
          totalSheets: "",
        },
        {
          type: "Other Paper",
          fullSheetSize: "",
          weight: "",
          paperType: "",
          totalSheets: "",
        },
      ],
      paperData2: [
        { type: "Paper", cutSheetSize: "", wastage: "", totalCutSheet: "" },
        {
          type: "Cover Paper",
          cutSheetSize: "",
          wastage: "",
          totalCutSheet: "",
        },
        {
          type: "Inner Paper",
          cutSheetSize: "",
          wastage: "",
          totalCutSheet: "",
        },
        {
          type: "Other Paper",
          cutSheetSize: "",
          wastage: "",
          totalCutSheet: "",
        },
      ],
      paperData3: [
        { ptype: "Paper", type: "", gsm: "", printColor: "", lamination: "" },
        {
          ptype: "Cover Paper",
          type: "",
          gsm: "",
          printColor: "",
          lamination: "",
        },
        {
          ptype: "Inner Paper",
          type: "",
          gsm: "",
          printColor: "",
          lamination: "",
        },
        {
          ptype: "Other Paper",
          type: "",
          gsm: "",
          printColor: "",
          lamination: "",
        },
      ],
    },
  });

  const paperData1 = watch("paperData1");
  const paperData2 = watch("paperData2");
  const paperData3 = watch("paperData3");

  useEffect(() => {
    let paperData = Cookies.get("PaperUnitsData");
    if (paperData != null) {
      let datas = JSON.parse(paperData);
      if (datas.paperData != null) {
        setValue("paperData0", datas.paperData.paperData0);
        setValue("paperData1", datas.paperData.paperData1);
        setValue("paperData2", datas.paperData.paperData2);
        setValue("paperData3", datas.paperData.paperData3);
        setValue("paperData0.side", datas.paperData.paperData0.side);
      }
    }
  }, []);

  const onSubmit = async (formData: PaperUnitData) => {
    const replaceEmptyWithNull = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === "") {
          obj[key] = null;
        }
      });
    };

    replaceEmptyWithNull(formData.paperData0);
    formData.paperData1.forEach(replaceEmptyWithNull);
    formData.paperData2.forEach(replaceEmptyWithNull);
    formData.paperData3.forEach(replaceEmptyWithNull);

    let papersData = {}
    if (formData.paperDataId) {
      papersData = {
        paperData: {
          paperData0: formData.paperData0,
          paperData1: formData.paperData1,
          paperData2: formData.paperData2,
          paperData3: formData.paperData3,
          paperDataId: formData.paperDataId
        },
      };

    } else {
      papersData = {
        paperData: {
          paperData0: formData.paperData0,
          paperData1: formData.paperData1,
          paperData2: formData.paperData2,
          paperData3: formData.paperData3,
        },
      };
    }


    console.log(papersData)
    Cookies.set("PaperUnitsData", JSON.stringify(papersData));
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

  const handleAdd1 = () => {
    const newRow = {
      type: "Other Paper",
      fullSheetSize: "",
      weight: "",
      paperType: "",
      totalSheets: "",
    };
    const updatedPaperData1 = [...paperData1, newRow];
    setValue("paperData1", updatedPaperData1);
  };

  const handleAdd2 = () => {
    const newRow = {
      type: "Other Paper",
      cutSheetSize: "",
      wastage: "",
      totalCutSheet: "",
    };
    const updatedPaperData2 = [...paperData2, newRow];
    setValue("paperData2", updatedPaperData2);
  };

  const handleAdd3 = () => {
    const newRow = {
      ptype: "Other Paper",
      type: "",
      gsm: "",
      printColor: "",
      lamination: "",
    };
    const updatedPaperData3 = [...paperData3, newRow];
    setValue("paperData3", updatedPaperData3);
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const currentValues = getValues("paperData0.side");
    if (checked) {
      setValue("paperData0.side", [...currentValues, value]);
    } else {
      setValue(
        "paperData0.side",
        currentValues.filter((v) => v !== value)
      );
    }
  };

  return (

    <div className="p-4 bg-white rounded-lg shadow overflow-y-auto max-h-[85vh]">
      <h2 className="text-2xl font-bold mb-4 text-center">Paper Unit</h2>
      <ScrollArea>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Full Sheet Size</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Paper type</TableHead>
                  <TableHead>Total Sheets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getValues("paperData1").map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.type}</TableCell>
                    {['fullSheetSize', 'weight', 'paperType', 'totalSheets'].map((field) => (
                      <TableCell key={field}>
                        <Controller
                          name={`paperData1.${index}.${field}` as `paperData1.${number}.${keyof PaperData1}`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} onKeyDown={handleKeyPress} />
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <Button type="button" variant="outline" className="hover:bg-[#07072e] hover:text-white" onClick={handleAdd1}>
                <MdAdd size={24} className="text-green-500" /> Add Row
              </Button>
            </div>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paper Type</TableHead>
                  <TableHead>Cut Sheet Size</TableHead>
                  <TableHead>Wastage</TableHead>
                  <TableHead>Total Cut Sheet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getValues("paperData2").map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.type}</TableCell>
                    {['cutSheetSize', 'wastage', 'totalCutSheet'].map((field) => (
                      <TableCell key={field}>
                        <Controller
                          name={`paperData2.${index}.${field}` as `paperData2.${number}.${keyof PaperData2}`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} onKeyDown={handleKeyPress} />
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <Button type="button" variant="outline" className="hover:bg-[#07072e] hover:text-white" onClick={handleAdd2}>
                <MdAdd size={24} className="text-green-500" /> Add Row
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {['readyBy', 'date', 'time', 'type', 'size', 'numberOfPages', 'printrun'].map((fieldName) => (
              <div key={fieldName}>
                <Label htmlFor={fieldName}>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</Label>
                <Controller
                  name={`paperData0.${fieldName}` as `paperData0.${keyof PaperUnitData['paperData0']}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id={fieldName}
                      type={fieldName === 'date' ? 'date' : fieldName === 'time' ? 'time' : 'text'}
                      onKeyDown={handleKeyPress}
                    />
                  )}
                />
              </div>
            ))}



            <div className="flex space-x-4 mt-[25px] w-[250px] ">
              <Label className="flex items-center space-x-2">
                <Controller
                  name="paperData0.side"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value.includes("singleside")}
                      onCheckedChange={(checked) => handleCheckboxChange("singleside", checked as boolean)}
                    />
                  )}
                />
                <span>Single Side</span>
              </Label>
              <Label className="flex items-center space-x-2">
                <Controller
                  name="paperData0.side"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value.includes("bothside")}
                      onCheckedChange={(checked) => handleCheckboxChange("bothside", checked as boolean)}
                    />
                  )}
                />
                <span>Both Side</span>
              </Label>
            </div>
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Paper Type</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>GSM</TableHead>
                  <TableHead>Print Color</TableHead>
                  <TableHead>Lamination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getValues("paperData3").map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.ptype}</TableCell>
                    {['type', 'gsm', 'printColor', 'lamination'].map((field) => (
                      <TableCell key={field}>
                        <Controller
                          name={`paperData3.${index}.${field}` as `paperData3.${number}.${keyof PaperData3}`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} onKeyDown={handleKeyPress} />
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <Button type="button" variant="outline" className="hover:bg-[#07072e] hover:text-white" onClick={handleAdd3}>
                <MdAdd size={24} className="text-green-500" /> Add Row
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
          </div>
        </form>
      </ScrollArea>
    </div >

  );
}