import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const vendorSchema = z.object({
  id: z.string(),
  vendorName: z.string().min(1, "Vendor name is required"),
  vendorAddress: z.string().min(1, "Vendor address is required"),
  vendorVAT: z.string().min(1, "Vendor VAT is required"),
  vendorPhone: z.string().min(1, "Vendor phone is required"),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface VendorFormProps {
  onSubmit: (data: VendorFormValues) => void;
  defaultValues?: Partial<VendorFormValues>;
  buttonText: React.ReactNode;
}

function VendorForm({ onSubmit, defaultValues, buttonText }: VendorFormProps) {
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vendorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor Name</FormLabel>
              <FormControl>
                <Input placeholder="Insert the vendor name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vendorAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Insert the address of the vendor"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vendorVAT"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor VAT</FormLabel>
              <FormControl>
                <Input placeholder="Insert the VAT of the vendor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vendorPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Insert the Vendor's phone number"
                  {...field}
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}

export default VendorForm;
