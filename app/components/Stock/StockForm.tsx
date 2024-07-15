import React, {useEffect, useState} from "react";
import axios from 'axios';
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { GrAddCircle } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import toast, { Toaster } from 'react-hot-toast';

const itemSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    availability: z.string().min(1, "Availability is required"),
});

const stockSchema = z.object({      
    items: z.array(itemSchema).min(1, "At least one item is required"),
});

type StockFormValues = z.infer<typeof stockSchema>;

interface StockFormProps {
    // onSubmit: (data: StockFormValues) => void;
    defaultValues?: Partial<StockFormValues>;
    buttonText: string;
    isSubmitting: boolean;
    inventoryId: string;
}

function StockForm({ defaultValues, buttonText, isSubmitting,inventoryId }: StockFormProps) {
    const form = useForm<StockFormValues>({
        resolver: zodResolver(stockSchema),
        defaultValues: {
            items: [
                { itemName: "", availability: "" },
            ],
        },
    });
    console.log(inventoryId);

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const addItem = () => {
        form.setValue(`items`, [
            ...form.getValues("items"),
            { itemName: "", availability: "" },
        ]);
    };

    const removeItem = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const [item, setItem] = useState<StockFormProps[]>([]);
    const onSubmit = async (data: StockFormValues) => {
        try {
            const url = `http://localhost:8000/add-item/${inventoryId}`;
            const response = await toast.promise(
                axios.post<StockFormProps>(url, data.items),
                {
                    loading: 'Creating item...',
                    success: (response) => {
                        console.log("Item created", response.data);
                        setItem([...item, response.data]);
                        return "Item created successfully";
                    },
                    error: (error) => {
                        console.error("Error occurred while creating a new item:", error);
                        return "Error creating item";
                    },
                },
                {
                    duration: 3000,
                }
            );
        } catch (error) {
            console.error("Error occurred while creating a new item:", error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit((data) => {
                    onSubmit(data);
                    form.reset(); // Optionally reset form after submission
                })}
                className="space-y-4"
            >
                {fields.map((item, index) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-md shadow-lg p-4 space-y-4"
                    >
                        <FormField
                            control={control}
                            name={`items.${index}.itemName`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormLabel className="ml-[300px]">
                                        <Button
                                            type="button"
                                            className="bg-transparent hover:bg-transparent transition-colors shadow-none"
                                            onClick={() => removeItem(index)}
                                        >
                                            <FiTrash2 className="mr-1 text-gray-600 text-[20px] hover:text-red-600" />
                                        </Button>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Insert the item name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`items.${index}.availability`}
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
                    </div>
                ))}
                <Button type="button" onClick={addItem} className="">
                    Add Item
                </Button>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {buttonText}
                </Button>
            </form>
        </Form>
    );
}

export default StockForm;