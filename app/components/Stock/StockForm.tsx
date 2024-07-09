import React, { useState, useEffect } from "react";
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

const stockSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    availability: z.string().min(1, "Availability is required"),
    type: z.string().min(1, "Type is required"),
});

type stockFormValues = z.infer<typeof stockSchema>;

interface StockFormProps {
    onSubmit: (data: stockFormValues) => void;
    defaultValues?: Partial<stockFormValues>;
    buttonText: string;
    isSubmitting: boolean;
}

function StockForm({ onSubmit, defaultValues, buttonText, isSubmitting }: StockFormProps) {
    const form = useForm<stockFormValues>({
        resolver: zodResolver(stockSchema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="itemName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Insert the item name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Availability</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Insert the availability of the item"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Input placeholder="Insert the type of the item" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {buttonText}
                </Button>
            </form>
        </Form>
    );
}

export default StockForm;