"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InventorySidebar from "../Sidebar/InventorySidebar";
import toast, { Toaster } from "react-hot-toast";
import { purchaseEntryService } from "@/app/services/purchaseEntryFormService";
import { vendorService } from "@/app/services/vendorService";
import { dashboardService } from "@/app/services/dashboardService";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineAddHomeWork, } from "react-icons/md";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { Send, Plus } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Textarea } from "@/components/ui/textarea";


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
  const [selectedItem, setSelectedItem] = useState<Item[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

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
    remove: removeFieldArrayEntry,
  } = useFieldArray({
    control: form.control,
    name: "purchaseEntry",
  });

  const removePurchaseEntry = (index: number) => {
    removeFieldArrayEntry(index);
    setSelectedVendors(prev => {
      const newSelected = [...prev];
      newSelected.splice(index, 1);
      return newSelected;
    });
  };

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
    setSelectedVendors(prev => [...prev, ""]);
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
              const storedStatus = localStorage.getItem('poStatus');
              const currentStatus = storedStatus ? JSON.parse(storedStatus) : {};
              const newStatus = { ...currentStatus, [orderId]: 'created' };

              console.log("Purchase order created:", response);

              localStorage.setItem('poStatus', JSON.stringify(newStatus));
              localStorage.removeItem(`formData_${orderId}`);

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

  const getTotalItems = () => {
    if (purchaseEntryFields.length === 0) return 0;
    return form.watch(`purchaseEntry.0.items`).length;
  };

  const initialWidth = useMemo(() => {
    const totalItems = getTotalItems();
    if (totalItems === 1) return 'max-w-3xl';
    if (totalItems === 2) return 'max-w-5xl';
    return 'max-w-6xl';
  }, []);

  const getItems = (value) => {
    const selectedInventory = inventory.find((inv) => inv._id === value);
    return selectedInventory ? selectedInventory.item : [];
  }

  return (
    <div className="flex flex-cols font-archivo h-screen bg-gray-200 overflow-hidden ">
      <div className="bg-white">
        <InventorySidebar />
      </div>
      <div className="flex-1  w-1/2 p-[10px] mt-[7px] ">
        <Card className={`w-full ${getTotalItems() <= 1 ? 'max-w-4xl' :
          getTotalItems() == 2 ? 'max-w-6xl' :
            getTotalItems() == 3 ? 'max-w-7xl' :
              'max-w-7xl'
          } justify-center items-center mx-auto transition-all duration-400 ease-in-out`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center mb-[-20px]">
              {isReorder ? "Reorder Slip" : "Purchase Order Slip"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="orderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="orderId" className="font-semibold">Order ID</FormLabel>
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

                  <div className={`${isReorder ? "max-h-[68vh]" : " max-h-[60.5vh]"} overflow-y-auto overflow-x-hidden`} >

                    {purchaseEntryFields && purchaseEntryFields.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="space-y-4 p-4 border rounded-lg mb-[20px]"
                      >
                        <div className="flex justify-end h-[0px]">
                          {!isReorder && (
                            <Label
                              className=" w-[110px] text-gray-400 cursor-pointer hover:text-[red] mt-[8px] mr-[-70px] transition-colors duration-100"
                              onClick={() => removePurchaseEntry(index)}
                            >
                              <HoverCard>
                                <HoverCardTrigger className="ml-[-110px] mb-[15px]">

                                </HoverCardTrigger>
                                <HoverCardContent>
                                  <p className="font-semibold text-gray-500">Remove the selected vendor?</p>
                                </HoverCardContent>
                              </HoverCard>
                            </Label>
                          )}
                          {!isReorder &&
                            <Button
                              type="button"
                              className="font-semibold bg-transparent text-red-500 bg-white shadow-none hover:bg-red-500 hover:text-white border mr-[10px]"
                              onClick={() => removePurchaseEntry(index)}
                            >
                              <FiTrash2 className=" hover:text-white mr-1" />
                              Delete Vendor

                            </Button>
                          }

                          {!isReorder &&
                            <Button
                              type="button"
                              className="font-semibold bg-transparent text-black bg-white shadow-none hover:bg-gray-800 hover:text-white border mr-[20px]"
                              onClick={() => addItem(index)}
                            >
                              <Plus className=" hover:text-white mr-1" />
                              Add Item

                            </Button>
                          }


                        </div>
                        <div className="">
                          <FormField
                            control={form.control}
                            name={`purchaseEntry.${index}.vendorId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-semibold ml-[25px]">Vendor</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedVendors(prev => {
                                      const newSelected = [...prev];
                                      newSelected[index] = value;
                                      return newSelected;
                                    });
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className=" w-[97%] ml-[20px] mr-[40px]">
                                      <SelectValue placeholder="Select a vendor" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {vendors.map((vendor) => (
                                      <SelectItem
                                        key={vendor._id}
                                        value={vendor._id}
                                        disabled={selectedVendors.includes(vendor._id) && selectedVendors.indexOf(vendor._id) !== index}
                                      >
                                        {vendor.vendorName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="h-[400px] overflow-y-auto scrollbar-hide p-4">
                            <div className={`grid ${form.watch(`purchaseEntry.${index}.items`).length === 1 ? 'grid-cols-1' :
                              form.watch(`purchaseEntry.${index}.items`).length === 2 ? 'grid-cols-2' :
                                'grid-cols-3'
                              } gap-6`}>
                              {form
                                .watch(`purchaseEntry.${index}.items`)
                                .map((item, itemIndex) => (
                                  <div key={itemIndex} className="space-y-4 border border-gray-200 rounded-[10px] p-[10px]">

                                    <FormField
                                      control={form.control}
                                      name={`purchaseEntry.${index}.items.${itemIndex}.inventoryId`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <div className="flex flex-cols justify-between">
                                            <div>
                                              <FormLabel className="font-semibold">Type</FormLabel>
                                            </div>
                                            <div>
                                              <FormLabel>
                                                {!isReorder && (
                                                  <Label
                                                    className="text-gray-400 hover:text-[red] mt-[10px]"
                                                    onClick={() => removeItem(index, itemIndex)}
                                                  >
                                                    <HoverCard>
                                                      <HoverCardTrigger>


                                                        <FiTrash2 className="text-xl cursor-pointer" />
                                                      </HoverCardTrigger>
                                                      <HoverCardContent>
                                                        <p className="font-semibold text-gray-500">Remove the selected item?</p>
                                                      </HoverCardContent>
                                                    </HoverCard>


                                                  </Label>
                                                )}
                                              </FormLabel>
                                            </div>

                                          </div>
                                          <Select
                                            onValueChange={(value) => {
                                              field.onChange(value);
                                              setSelectedItem(getItems(value));
                                            }}
                                            value={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {inventory.map((inv) => (
                                                <SelectItem key={inv._id} value={inv._id}>
                                                  {inv.type}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    { }
                                    <FormField
                                      control={form.control}
                                      name={`purchaseEntry.${index}.items.${itemIndex}.itemId`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <div className="flex flex-row justify-between pr-[10px]">
                                            <div>
                                              <FormLabel className="font-semibold">Item</FormLabel>
                                            </div>
                                          </div>
                                          <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={!form.watch(`purchaseEntry.${index}.items.${itemIndex}.inventoryId`)}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select an item" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {selectedItem.map((item) => (
                                                <SelectItem key={item._id} value={item._id}>
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
                                          <FormLabel className="font-semibold">Quantity from Vendor</FormLabel>
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
                                          <FormLabel className="font-semibold">Quantity from Stock</FormLabel>
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
                                            <FormLabel className="font-semibold">Remarks</FormLabel>
                                            <FormControl>
                                              <Textarea 
                                                {...field}
                                                placeholder="Enter remarks for reorder"
                                                className="h-[70px]"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    )}


                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>


                  {!isReorder && (
                    <Button type="button" className="font-semibold" onClick={addVendor}>
                      <MdOutlineAddHomeWork size={18} className="mr-[10px]" /> Add Vendor
                    </Button>
                  )}

                  <Button type="submit" className="w-full  font-semibold"
                    isSubmitting={isSubmitting}>
                    <Send size={18} className="mr-[10px]" />
                    {isReorder ? "Submit Reorder" : "Submit Purchase Order"}
                  </Button>
                </form>

              </Form>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}