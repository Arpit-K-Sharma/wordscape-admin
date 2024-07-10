"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import InventorySidebar from "../Sidebar/InventorySidebar";

const itemSchema = z.object({
  itemId: z.string(),
  quantityFromVendor: z.number().int(),
  quantityFromStock: z.number().int(),
  itemCode: z.string(),
  rate: z.number(),
  amount: z.number(),
});

const formSchema = z.object({
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

const Reorder: React.FC = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/reorder/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        router.push("/inventory");
      } else {
        console.error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex">
      <InventorySidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Reorder Form</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isCompleted"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Is Completed</FormLabel>
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-semibold mb-2">Items</h3>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 mb-4 p-4 border rounded"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.itemId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantityFromVendor`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity from Vendor</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantityFromStock`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity from Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.itemCode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.rate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="destructive"
                  >
                    Remove Item
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  append({
                    itemId: "",
                    quantityFromVendor: 0,
                    quantityFromStock: 0,
                    itemCode: "",
                    rate: 0,
                    amount: 0,
                  })
                }
              >
                Add Item
              </Button>
            </div>

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VAT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grandTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grand Total</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Input
              type="text"
              placeholder="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="mb-4"
            />

            <Button type="submit">Submit Reorder</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Reorder;
