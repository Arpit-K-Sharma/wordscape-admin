"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InventorySidebar from "../Sidebar/InventorySidebar";

const itemSchema = z.object({
  itemId: z.string(),
  quantityFromVendor: z.number(),
  quantityFromStock: z.number(),
});

const purchaseEntrySchema = z.object({
  vendorId: z.string(),
  isCompleted: z.boolean().default(false),
  items: z.array(itemSchema),
});

const formSchema = z.object({
  orderId: z.string(),
  isCompleted: z.boolean().default(false),
  purchaseEntry: z.array(purchaseEntrySchema),
});

interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

interface Item {
  _id: string;
  itemName: string;
}

interface ApprovedOrders {
  _id: string;
}

interface PurchaseEntrySlipProps {
  orderId: string;
}

export function PurchaseEntrySlip({ orderId }: PurchaseEntrySlipProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<ApprovedOrders[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: orderId,
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
            },
          ],
        },
      ],
    },
  });

  const {
    fields: purchaseEntryFields,
    append: appendPurchaseEntry,
    remove: removePurchaseEntry,
  } = useFieldArray({
    control: form.control,
    name: "purchaseEntry",
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/vendors");
        setVendors(response.data.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/inventory");
        console.log(response);
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetch_approved_orders = async () => {
      try {
        const orders = await axios.get(
          "http://127.0.0.1:8000/get/approved_orders"
        );
        setApprovedOrders(orders.data.data);
        console.log(orders.data.data);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    fetch_approved_orders();
    fetchVendors();
    fetchItems();

    if (orderId) {
      form.setValue("orderId", orderId);
    }
  }, [orderId, form]);

  const addItem = (index: number) => {
    form.setValue(`purchaseEntry.${index}.items`, [
      ...form.getValues(`purchaseEntry.${index}.items`),
      {
        itemId: "",
        quantityFromVendor: 0,
        quantityFromStock: 0,
      },
    ]);
  };

  const removeItem = (entryIndex: number, itemIndex: number) => {
    const items = form.getValues(`purchaseEntry.${entryIndex}.items`);
    items.splice(itemIndex, 1);
    form.setValue(`purchaseEntry.${entryIndex}.items`, items);
  };

  const addVendor = () => {
    appendPurchaseEntry({
      vendorId: "",
      isCompleted: false,
      items: [
        {
          itemId: "",
          quantityFromVendor: 0,
          quantityFromStock: 0,
        },
      ],
    });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/purchase_order",
        data
      );
      console.log("Purchase order created:", response.data);
      alert("Purchase Order Placed");
    } catch (error) {
      console.error("Error creating purchase order:", error);
    }
  };

  return (
    <div className="flex font-archivo bg-[#f7f7f9]">
      <InventorySidebar />
      <div className="flex-1 p-5">
        <Card className="w-full max-w-2xl justify-center items-center mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Purchase Order Slip
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
                      <FormLabel htmlFor="orderId">Order ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          id="orderId"
                          disabled
                          className="text-[15px] font-semibold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {purchaseEntryFields.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="space-y-4 p-4 border rounded-lg"
                  >
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
                          <div className="flex justify-end h-[0px] ">
                            <Label
                              className=" w-[110px] hover:text-[red] mt-[8px]"
                              onClick={() => removePurchaseEntry(index)}
                            >
                              - Remove Vendor
                            </Label>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form
                      .watch(`purchaseEntry.${index}.items`)
                      .map((item, itemIndex) => (
                        <div key={itemIndex} className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`purchaseEntry.${index}.items.${itemIndex}.itemId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Item</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an item" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {items.map((item) => (
                                      <SelectItem
                                        key={item._id}
                                        value={item._id}
                                      >
                                        {item.itemName}
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
                            name={`purchaseEntry.${index}.items.${itemIndex}.quantityFromVendor`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity from Vendor</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`purchaseEntry.${index}.items.${itemIndex}.quantityFromStock`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity from Stock</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-between">
                            <Button
                              type="button"
                              onClick={() => addItem(index)}
                            >
                              + Add Item
                            </Button>
                            <Label
                              className="hover:text-[red]"
                              onClick={() => removeItem(index, itemIndex)}
                            >
                              - Remove Item
                            </Label>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}

                <Button type="button" onClick={addVendor}>
                  + Add Vendor
                </Button>

                <Button type="submit" className="w-full">
                  Submit Purchase Order
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
