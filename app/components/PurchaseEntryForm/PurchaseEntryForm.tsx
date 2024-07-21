"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
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
import toast, { Toaster } from "react-hot-toast";
import { purchaseEntryService } from "@/app/services/purchaseEntryFormService";
import { vendorService } from "@/app/services/vendorService";
import { dashboardService } from "@/app/services/dashboardService";


const itemSchema = z.object({
  inventoryId: z.string(),
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
  remarks: z.string().optional(),
});

interface Vendor {
  _id: string;
  vendorName: string;
  vendorAddress: string;
  vendorVAT: string;
  vendorPhone: string;
}

interface ApprovedOrders {
  _id: string;
}

interface PurchaseEntrySlipProps {
  orderId: string;
  isReorder?: boolean;
}

interface Item {
  _id: string;
  itemName: string;
  availability: number;
}

interface Inventory {
  _id: string;
  item: Item[];
}

interface CustomButtonProps {
  type: "submit" | "button" | "reset";
  className?: string;
  isSubmitting?: boolean;
  onClick?: () => void;
}

export function PurchaseEntrySlip({ orderId, isReorder }: PurchaseEntrySlipProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<ApprovedOrders[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

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
              inventoryId: "",
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
        const vendors = await vendorService.getVendors();
        setVendors(vendors);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        setVendors([]);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await purchaseEntryService.getItems();
        setInventory(response);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetch_approved_orders = async () => {
      try {
        const orders = await dashboardService.fetch_approved_orders();
        setApprovedOrders(orders);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    fetchVendors();
    fetchItems();
    fetch_approved_orders();

    if (orderId) {
      form.setValue("orderId", orderId);
    }

    if (isReorder) {
      fetchReorderData();
    }
  }, [orderId, form, isReorder]);

  const addItem = (index: number) => {
    form.setValue(`purchaseEntry.${index}.items`, [
      ...form.getValues(`purchaseEntry.${index}.items`),
      {
        inventoryId: "",
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
          inventoryId: "",
          itemId: "",
          quantityFromVendor: 0,
          quantityFromStock: 0,
        },
      ],
    });
  };

  const fetchReorderData = async () => {
    try {
      const purchase_order = await purchaseEntryService.getPurchaseEntries()
      const orderData = purchase_order;

      form.reset({
        orderId: orderId,
        isCompleted: false,
        purchaseEntry: [{
          vendorId: orderData.purchaseEntry[0].vendorId,
          isCompleted: false,
          items: orderData.purchaseEntry[0].items.map((item: any) => ({
            inventoryId: item.inventoryId,
            itemId: item.itemId,
            quantityFromVendor: item.quantityFromVendor,
            quantityFromStock: 0
          }))
        }]
      });
    } catch (error) {
      console.error("Error fetching reorder data:", error);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      if (isReorder) {
        const reorderData = {
          vendorId: data.purchaseEntry[0].vendorId,
          isCompleted: false,
          tag: "reorder",
          remarks: data.remarks || "Reorder",
          items: data.purchaseEntry[0].items.map(item => ({
            inventoryId: item.inventoryId,
            itemId: item.itemId,
            quantityFromVendor: item.quantityFromVendor,
            quantityFromStock: item.quantityFromStock
          }))
        };

        await toast.promise(
          axios.post(`http://localhost:8000/reOrder/${orderId}`, reorderData),
          {
            loading: 'Creating reorder...',
            success: (response) => {
              console.log("Reorder created:", response.data);
              // Update the PO status in localStorage
              const storedStatus = localStorage.getItem('poStatus');
              const currentStatus = storedStatus ? JSON.parse(storedStatus) : {};
              const newStatus = { ...currentStatus, [orderId]: 'created' };

              localStorage.setItem('poStatus', JSON.stringify(newStatus));

              localStorage.removeItem(`formData_${orderId}`);

              return "Reorder Placed Successfully";
            },
            error: "Error creating reorder",
          },
          {
            duration: 3000,
          }
        );
      } else {
        await toast.promise(
          purchaseEntryService.createPurchaseEntry(data),
          {
            loading: 'Creating purchase order...',
            success: (response) => {
              console.log("Purchase order created:", response);
              return "Purchase Order Placed Successfully";
            },
            error: "Error creating purchase order",
          },
          {
            duration: 3000,
          }
        );
      }

      // Wait for an additional moment to ensure the success message is seen
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate after the success message has been displayed
      router.push('/');

    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveFormDataToLocalStorage = (data: z.infer<typeof formSchema>) => {
    try {
      localStorage.setItem(`formData_${orderId}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendors = await vendorService.getVendors();
        setVendors(vendors);
        
        const response = await purchaseEntryService.getItems();
        setInventory(response);
        
        const orders = await dashboardService.fetch_approved_orders();
        setApprovedOrders(orders);
  
        // Load form data from localStorage
        const storedFormData = localStorage.getItem(`formData_${orderId}`);
        if (storedFormData) {
          const parsedData = JSON.parse(storedFormData);
          form.reset(parsedData);
        } else if (orderId) {
          form.setValue("orderId", orderId);
        }
  
        if (isReorder) {
          fetchReorderData();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [orderId, form, isReorder]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      saveFormDataToLocalStorage(value as z.infer<typeof formSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, orderId]);


  return (
    <div className="flex font-archivo bg-[#f7f7f9]">
      <InventorySidebar />
      <div className="print flex-1 p-5 h-screen">
        <Card className="w-full max-w-2xl justify-center items-center mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isReorder ? "Reorder Slip" : "Purchase Order Slip"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                {purchaseEntryFields && purchaseEntryFields.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="flex justify-end h-[0px] ">
                      {!isReorder && (
                        <Label
                          className=" w-[110px] hover:text-[red] mt-[8px]"
                          onClick={() => removePurchaseEntry(index)}
                        >
                          - Remove Vendor
                        </Label>
                      )}

                    </div>
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
                                  onValueChange={(value) => {
                                    const selectedInventory = inventory.find(inv =>
                                      inv.item.some(item => item._id === value)
                                    );
                                    if (selectedInventory) {
                                      field.onChange(value);
                                      form.setValue(`purchaseEntry.${index}.items.${itemIndex}.inventoryId`, selectedInventory._id);
                                    }
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an item" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {inventory.flatMap(inv =>
                                      inv.item.map(item => (
                                        <SelectItem key={item._id} value={item._id}>
                                          {item.itemName}
                                        </SelectItem>
                                      ))
                                    )}
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
                          {isReorder && (
                            <FormField
                              control={form.control}
                              name="remarks"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Remarks</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="text"
                                      placeholder="Enter remarks for reorder"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          <div className="flex justify-between">
                            {!isReorder && (
                              <Button
                                type="button"
                                onClick={() => addItem(index)}
                              >
                                + Add Item
                              </Button>
                            )}
                            {!isReorder && (
                              <Label
                                className="hover:text-[red]"
                                onClick={() => removeItem(index, itemIndex)}
                              >
                                - Remove Item
                              </Label>
                            )}

                          </div>
                        </div>
                      ))}
                  </div>
                ))}
                {!isReorder && (
                  <Button type="button" onClick={addVendor}>
                    + Add Vendor
                  </Button>
                )}


                <Button type="submit" className="w-full"
                  isSubmitting={isSubmitting}>
                  {isReorder ? "Submit Reorder" : "Submit Purchase Order"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}