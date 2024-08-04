'use client'

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCheck } from "react-icons/fa";

interface PaperDetailProps {
  data: {
    paperSize: string;
    gutterSize: string;
    gripperSize: string;
    coverPaperSize: string;
    innerPaperSize: string;
    folderName: string;
    plateProcessBy: string;
    paperDetailDataId?: number;
  };
  onChildData: (open: boolean) => void;
  onSave: () => void;
}

interface FormData {
  paperSize: string;
  gutterSize: string;
  gripperSize: string;
  coverPaperSize: string;
  innerPaperSize: string;
  folderName: string;
  plateProcessBy: string;
  paperDetailDataId?: number;
}

export default function PaperDetail({ data, onChildData, onSave }: PaperDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<FormData>();

  useEffect(() => {
    let paperData = Cookies.get("paperData");
    if (paperData != null) {
      let datas = JSON.parse(paperData);
      if(datas.paperDetail != null){
      setValue("paperSize", datas.paperDetail.paperSize);
      setValue("gutterSize", datas.paperDetail.gutterSize);
      setValue("gripperSize", datas.paperDetail.gripperSize);
      setValue("coverPaperSize", datas.paperDetail.coverPaperSize);
      setValue("innerPaperSize", datas.paperDetail.innerPaperSize);
      setValue("folderName", datas.paperDetail.folderName);
      setValue("plateProcessBy", datas.paperDetail.plateProcessBy);
    }
  }
  }, []);

  const onSubmit = async (formData: FormData) => {
    console.log(formData);
  
    let jsonData = {
      paperDetail: {
        paperSize: formData.paperSize,
        gutterSize: formData.gutterSize,
        gripperSize: formData.gripperSize,
        coverPaperSize: formData.coverPaperSize,
        innerPaperSize: formData.innerPaperSize,
        folderName: formData.folderName,
        plateProcessBy: formData.plateProcessBy,
      }
    };
    console.log("Paper Data from Paper Details: ", jsonData);
  
    // if (formData.paperDetailDataId) {
    //   jsonData.paperDetail.paperDetailDataId = formData.paperDetailDataId;
    // }

    Cookies.set("paperData", JSON.stringify(jsonData));
    console.log("Paper Data from Paper Details: ", jsonData);
    onChildData(false);
    onSave();
    setIsSaved(true);
    onSave();

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
      <h2 className="text-2xl font-bold mb-6 text-center">Paper Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          "paperSize",
          "gutterSize",
          "gripperSize",
          "coverPaperSize",
          "innerPaperSize",
          "folderName",
          "plateProcessBy"
        ].map((field) => (
          <div key={field} className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor={field} className="text-right">
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </Label>
            <Input
              id={field}
              className="col-span-2"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              {...register(field as keyof FormData)}
              onKeyDown={handleKeyPress}
            />
          </div>
        ))}
        <div className="flex justify-end mt-6">
          <Button type="submit">{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
        </div>
      </form>
    </div>
  );
}