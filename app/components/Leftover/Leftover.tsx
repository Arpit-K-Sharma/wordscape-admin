"use client"
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { leftoverService } from '@/app/services/leftoverService';
import InventorySidebar from '../Sidebar/InventorySidebar';

import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface InventoryItem {
    _id: string;
    type: string;
    item: {
        _id: string;
        itemName: string;
        availability: number;
    }[];
}

interface LeftoverItem {
    item_id: string;
    quantity: number;
    reason: string;
}

interface Leftover {
    _id: string;
    order_id: string;
    items: LeftoverItem[];
}

interface LeftoverFormProps {
    orderId: string;
    onSubmit: (data: any) => void;
}

const LeftoverForm: React.FC<LeftoverFormProps> = ({ orderId, onSubmit }) => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            order_id: orderId,
            items: [{ item_id: '', quantity: 0, reason: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    useEffect(() => {
        const fetchInventory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8000/inventory');
                console.log('Inventory data:', response.data);
                setInventory(response.data.data);
            } catch (error) {
                console.error('Error fetching inventory:', error);
                setError('Failed to fetch inventory. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const handleSubmit = (data: any) => {
        onSubmit(data);
    };

    if (isLoading) return <div>Loading inventory...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex space-x-4">
                        <FormField
                            control={form.control}
                            name={`items.${index}.item_id`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {inventory.flatMap(inv =>
                                                inv.item.map(item => (
                                                    <SelectItem key={item._id} value={item._id}>{item.itemName}</SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`items.${index}.reason`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason</FormLabel>
                                    <Input {...field} />
                                </FormItem>
                            )}
                        />
                        <Button type="button" onClick={() => remove(index)}>Remove</Button>
                    </div>
                ))}
                <Button type="button" onClick={() => append({ item_id: '', quantity: 0, reason: '' })}>
                    Add Item
                </Button>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};

const LeftoverPage: React.FC<{ orderId: string }> = ({ orderId }) => {
    const [leftovers, setLeftovers] = useState<Leftover[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [leftoverResponse, inventoryResponse] = await Promise.all([
                    leftoverService.fetchLeftovers(orderId),
                    leftoverService.fetchInventory()
                ]);
                setLeftovers(leftoverResponse);
                setInventory(inventoryResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [orderId]);

    const handleSubmit = async (data: any) => {
        try {
            await leftoverService.postInventory(data)
            setIsDialogOpen(false);
            // Refetch leftovers
            const response = await leftoverService.fetchLeftovers(orderId);
            setLeftovers(response);
        } catch (error) {
            console.error('Error submitting leftover:', error);
            setError('Failed to submit leftover. Please try again.');
        }

    };

    const getItemName = (itemId: string) => {
        console.log(inventory)
        for (const inv of inventory) {
            const item = inv.item.find(i => i._id === itemId);
            if (item) return item.itemName;
        }
        return 'Unknown Item';
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex h-screen bg-gray-100 font-archivo">
            <InventorySidebar />

            <div className="container mx-auto p-4 ml-[20px] mr-[20px]">
                <h1 className="text-2xl font-bold mb-4 mt-[20px]">Leftovers for Order {orderId}</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Leftover</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Leftover</DialogTitle>
                        </DialogHeader>
                        <LeftoverForm orderId={orderId} onSubmit={handleSubmit} />
                    </DialogContent>
                </Dialog>
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Left Over Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px]">
                            <Table className="w-full text-sm text-left rtl:text-right text-white">
                                <TableHeader className="text-xs text-black uppercase bg-gray-100 shadow-md">
                                    <TableRow>
                                        <TableHead className="py-[30px] flex items-center"></TableHead>
                                        <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                                            Item Name
                                        </TableHead>
                                        <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                                            Quantity
                                        </TableHead>
                                        <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                                            Reason
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leftovers.flatMap((leftover) =>
                                        leftover.items.map((item, index) => (
                                            <TableRow
                                                key={`${leftover._id}-${index}`}
                                                className="bg-white border-b font-medium text-[17px] hover:bg-gray-200 text-black"
                                            >
                                                <TableCell className="w-4 p-4 text-[17px]"></TableCell>
                                                <TableCell className="px-6 font-medium text-[17px] whitespace-nowrap text-black py-[20px]">
                                                    {getItemName(item.item_id)}
                                                </TableCell>
                                                <TableCell className="px-6 py-[20px]">{item.quantity}</TableCell>
                                                <TableCell className="px-6 py-[20px]">{item.reason}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LeftoverPage;