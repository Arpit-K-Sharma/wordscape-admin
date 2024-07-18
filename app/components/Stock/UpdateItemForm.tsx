import React, { useState } from 'react'
import axios from 'axios';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import toast from 'react-hot-toast';

const itemSchema = z.object({
    availability: z.string().min(1, "Availability is required"),
});

const stockSchema = z.object({
    item: z.array(itemSchema).min(1, "At least one item is required"),
});

type UpdateFormValues = z.infer<typeof stockSchema>;

interface UpdateFormProps {
    defaultValues?: Partial<UpdateFormValues>;
    buttonText: string;
    isSubmitting: boolean;
    inventoryId: string;
    itemId: string;
    onClose: () => void; 
    onSubmit: (data: {
        type: string;
        itemName: string;
        availability: string;
    }) => Promise<void>;
}

function UpdateItemForm({ defaultValues, buttonText, isSubmitting, inventoryId, itemId, onClose }: UpdateFormProps) {
    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(stockSchema),
        defaultValues: {
            item: [
                { availability: "" },
            ],
        },
    });

    const { control, handleSubmit } = form;

    const onSubmit = async (data: UpdateFormValues) => {
        try {
            const url = `http://127.0.0.1:8000/update-item/${inventoryId}/${itemId}`;
            const availability = parseInt(data.item[0].availability, 10);
            const response = await axios.put(url, availability, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Item updated", response.data);
            toast.success('Availability updated successfully!');
            onClose();  
        } catch (error) {
            console.error("Error occurred while updating the item:", error);
            toast.error('Failed to update availability. Please try again.');
        }
    };

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="bg-white rounded-md shadow-lg p-4 space-y-4">
                        <FormField
                            control={control}
                            name="item.0.availability"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Availability</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder="Insert the availability of the item"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {buttonText}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default UpdateItemForm