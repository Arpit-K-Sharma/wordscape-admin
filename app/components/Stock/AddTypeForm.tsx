import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useForm, useFieldArray, Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";  
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from 'react-hot-toast';

// Define the zod schema for item validation
const itemSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    availability: z.string().min(1, "Availability is required"),
});

// Define the zod schema for type validation
const typeSchema = z.object({
    type: z.string(),
    item: z.array(
        itemSchema
    ),
});

// Infer the type from the typeSchema
type TypeFormValues = z.infer<typeof typeSchema>;

// Define the interface for the item structure
interface Item {
    itemName: string;
    availability: string;
}

// Define the props interface for TypeForm component
interface TypeFormProps {
    // onSubmit: (data: TypeFormValues) => Promise<void>;
    defaultValues?: Partial<TypeFormValues>;
    buttonText: string;
    isSubmitting: boolean;
    onSubmit: (data: {
        type: string;
        itemName: string;
        availability: string;
    }) => Promise<void>;
}

// TypeForm component
function TypeForm({
    // onSubmit,
    defaultValues,
    buttonText,
    isSubmitting,
}: TypeFormProps) {
    const form = useForm<TypeFormValues>({
        resolver: zodResolver(typeSchema),
        defaultValues: defaultValues ?? {
            type: "",
            item: [{ itemName: "", availability: "" }],
        },
    });


    const [item, setItem] = useState<TypeFormProps[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const onSubmit = async (data: TypeFormValues) => {
        try {
            const url = "http://localhost:8000/inventory";
            await toast.promise(
                axios.post<TypeFormProps>(url, data),
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
        setIsAddDialogOpen(false);
    };


    const { control, handleSubmit} = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "item",
    });

    // Function to add a new item
    const addItem = () => {
        form.setValue("item", [
            ...fields,
            { itemName: "", availability: "" },
        ]);
    };

    // Function to remove an item by index
    const removeItem = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(async (data) => {
                await onSubmit(data);
                form.reset();
                setIsAddDialogOpen(false);
            })}
                className="space-y-4"
            >
                {fields.map((item, index) => (
                    <div key={item.id} className="bg-white rounded-md shadow-lg p-4 space-y-4">
                        <FormField
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Insert the type" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`item.${index}.itemName`}
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
                            control={control}
                            name={`item.${index}.availability`}
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

                        {/* <Button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="bg-transparent hover:bg-transparent transition-colors shadow-none"
                        >
                            <FiTrash2 className="mr-1 text-gray-600 text-[20px] hover:text-red-600" />
                        </Button> */}
                    </div>
                ))}

                {/* <Button type="button" onClick={addItem}>
                    Add Item
                </Button> */}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {buttonText}
                </Button>
            </form>
        </Form>
    );
}

export default TypeForm;
