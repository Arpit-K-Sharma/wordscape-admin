import React, { useState, useEffect } from 'react'
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

const itemSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    availability: z.string().min(1, "Availability is required"),
});

const stockSchema = z.object({
    item: z.array(itemSchema).min(1, "At least one item is required"),
});

type UpdateFormValues = z.infer<typeof stockSchema>;

interface UpdateFormProps {
    // onSubmit: (data: UpdateFormValues) => void;
    defaultValues?: Partial<UpdateFormValues>;
    buttonText: string;
    isSubmitting: boolean;
    inventoryId: string;
    itemId: string;
}

function UpdateItemForm({ defaultValues, buttonText, isSubmitting, inventoryId, itemId }: UpdateFormProps) {
    const form = useForm<UpdateFormValues>({
        resolver: zodResolver(stockSchema),
        defaultValues: {
            item: [
                { itemName: "", availability: "" },
            ],
        },
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "item",
    });

    const [item, setItem] = useState<UpdateFormProps[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const onSubmit = async (data: UpdateFormValues) => {
        try {
            const url = `http:/update-item/${inventoryId}/${itemId}`;
            const response = await axios.post<UpdateFormProps>(url, data);
            console.log("Item created", response.data);
            setItem([...item, response.data]);
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Error occurred while creating a new item:", error);
        }
    };

    return (
        <div>
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
                        </div>
                    ))}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {buttonText}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default UpdateItemForm
