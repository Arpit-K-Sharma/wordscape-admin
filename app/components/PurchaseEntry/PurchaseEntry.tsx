"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InventorySidebar from "../Sidebar/InventorySidebar";

const itemSchema = z.object({
  itemId: z.string(),
  quantityFromVendor: z.number(),
  quantityFromStock: z.number(),
  itemCode: z.string(),
  rate: z.number(),
  amount: z.number(),
});

const purchaseEntrySchema = z.object({
  vendorId: z.string(),
  isCompleted: z.boolean(),
  items: z.array(itemSchema),
  tag: z.string(),
  remarks: z.string(),
  image: z.string(),
  discount: z.number(),
  vat: z.number(),
  grandTotal: z.number(),
  invoiceNo: z.string(),
  invoiceDate: z.string(),
});

const formSchema = z.object({
  orderId: z.string(),
  isCompleted: z.boolean(),
  purchaseEntry: z.array(purchaseEntrySchema),
});

interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

export function PurchaseEntrySlip() {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: "",
      isCompleted: false,
      purchaseEntry: [
        {
          vendorId: "",
          isCompleted: false,
          items: [
            {
              itemId: "",
              quantityFromVendor: 0,
              quantityFromStock: 0,
              itemCode: "",
              rate: 0,
              amount: 0,
            },
          ],
          tag: "",
          remarks: "",
          image: "",
          discount: 0,
          vat: 0,
          grandTotal: 0,
          invoiceNo: "",
          invoiceDate: "",
        },
      ],
    },
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("/vendors");
        setVendors(response.data.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/purchase_order", data);
      console.log("Purchase order created:", response.data);
    } catch (error) {
      console.error("Error creating purchase order:", error);
    }
  };

  return (
    <div className="flex font-archivo">
      <InventorySidebar />
      <div className="flex-1 p-8 mt-5">
        <Card className="w-full max-w-2xl mt-8 justify-center items-center mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Purchase Entry Slip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="orderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isCompleted"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Is Completed
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {form.watch("purchaseEntry").map((entry, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <FormField
                      control={form.control}
                      name={`purchaseEntry.${index}.vendorId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a vendor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vendors.map((vendor) => (
                                <SelectItem key={vendor._id} value={vendor._id}>
                                  {vendor.vendorName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`purchaseEntry.${index}.invoiceNo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice No</FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`purchaseEntry.${index}.invoiceDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`purchaseEntry.${index}.remarks`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remarks</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* You can add more fields here for items, discount, vat, etc. */}
                  </div>
                ))}

                <Button type="submit" className="w-full">
                  Submit Purchase Entry
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
