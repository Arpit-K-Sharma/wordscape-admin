'use client'

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FaCheck } from "react-icons/fa";

interface BinderyProps {
  data: any;
  onChildData: (value: boolean) => void;
  onSave: () => void;
}

export default function Bindery({ data, onChildData, onSave }: BinderyProps) {
  const [customOption, setCustomOption] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      filledBy: "",
      approvedBy: "",
      bindingUnitId: 0,
      selectedOptions: [] as string[],
    },
  });

  const selectedOptions = watch("selectedOptions", []);

  useEffect(() => {
    let binderyData = Cookies.get('binderyData');   
      if(binderyData != null ){
        let data = JSON.parse(binderyData);
        if(data.binderyData != null){
        setValue("filledBy", data.binderyData.filledInBy || "");
        setValue("approvedBy", data.binderyData.approvedBy || "");
        setValue("selectedOptions", data.binderyData.binderySelectedOption || []);
        }    
      }
      }
  , []);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = document.querySelectorAll("input");
      const currentIndex = Array.from(inputs).findIndex(
        (input) => document.activeElement === input
      );
      const nextIndex = currentIndex + 1;
      if (nextIndex < inputs.length) {
        (inputs[nextIndex] as HTMLElement).focus();
      }
    }
  };

  const handleCheckboxChange = (value: string) => {
    const currentSelection = watch("selectedOptions");
    if (currentSelection.includes(value)) {
      setValue(
        "selectedOptions",
        currentSelection.filter((option) => option !== value)
      );
    } else {
      setValue("selectedOptions", [...currentSelection, value]);
    }
  };

  const handleCustomOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomOption(e.target.value);
  };

  const addCustomOption = () => {
    if (customOption && !selectedOptions.includes(customOption)) {
      setValue("selectedOptions", [...selectedOptions, customOption]);
      setCustomOption("");
    }
  };

  const removeCustomOption = (option: string) => {
    setValue(
      "selectedOptions",
      selectedOptions.filter((selectedOption) => selectedOption !== option)
    );
  };

  const onSubmit = async (formData: any) => {
    let jsondata = {
      binderyData: {
        filledInBy: formData.filledBy,
        approvedBy: formData.approvedBy,
        binderySelectedOption: formData.selectedOptions,
      },
    };
    // if (formData.bindingUnitId) {
    //   jsondata.binderyData.bindingUnitId = formData.bindingUnitId;
    // }
    console.log("Bindery Data in JSON", jsondata);
    Cookies.set("binderyData", JSON.stringify(jsondata));
    onChildData(false);
    onSave();
    setIsSaved(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Bindery</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bindery">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {["Center Stitch", "Perfect", "N/A", "juju", "metal-foiling", "diecuting", "perforation", "padding", "spot-varnishing"].map((option) => (
              <div key={option} className="flex items-center">
                <Checkbox
                  id={option}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={() => handleCheckboxChange(option)}
                />
                <label htmlFor={option} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mb-6">
            <Input
              type="text"
              value={customOption}
              onChange={handleCustomOptionChange}
              placeholder="Custom option"
              className="w-full max-w-xs"
            />
            <Button type="button" onClick={addCustomOption}>
              Add
            </Button>
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Selected Options:</h4>
            <ul className="space-y-2">
              {selectedOptions.length > 0 ? selectedOptions.map((option, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{option}</span>
                  <Button
                    type="button"
                    onClick={() => removeCustomOption(option)}
                    className="text-red-500 hover:text-red-700"
                    variant="ghost"
                    size="sm"
                  >
                    <FiX />
                  </Button>
                </li>
              )) : null}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1"> Filled-in By: </label>
            <Input
              type="text"
              {...register("filledBy")}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div>
            <label className="block mb-1">Approved By: </label>
            <Input
              type="text"
              {...register("approvedBy")}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">{isSaved && <FaCheck className="text-green-500 mr-2" />}Save</Button>
        </div>
      </form>
    </div>
  );
}