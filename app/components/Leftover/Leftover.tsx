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
import { AlertCircle, BarChart2, Package, PlusCircle, Send, ShoppingCart, Trash2 } from "lucide-react";
import toast from 'react-hot-toast';

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
    inventory_id: string;
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
            items: [{ inventory_id: '', item_id: '', quantity: 0, reason: '' }]
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
                    <div key={field.id} className="flex flex-col space-y-4 shadow-md p-[10px] rounded-md">
                        <div className=''>
                            <div className="flex flex-row w-[70px]">
                                <div className='ml-[390px]'>
                                    <Button type="button"
                                        className='bg-transparent hover:bg-transparent shadow-sm self-start'
                                        onClick={() => remove(index)}>
                                        <Trash2 className="mr-1 text-gray-800  hover:text-red-600" size={18} />
                                    </Button>
                                </div>

                            </div>
                        <FormField
                            control={form.control}
                            name={`items.${index}.item_id`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item</FormLabel>
                                    <Select 
                                        onValueChange={(value) => {
                                            const [inventoryId, itemId] = value.split('|');
                                            form.setValue(`items.${index}.inventory_id`, inventoryId);
                                            field.onChange(itemId);
                                        }} 
                                        value={field.value ? `${form.getValues(`items.${index}.inventory_id`)}|${field.value}` : ''}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {inventory.flatMap(inv =>
                                                inv.item.map(item => (
                                                    <SelectItem key={`${inv._id}|${item._id}`} value={`${inv._id}|${item._id}`}>
                                                        {item.itemName}
                                                    </SelectItem>
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
                                    <FormItem className='p-[10px]'>
                                        <FormLabel className='font-semibold'>Quantity</FormLabel>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`items.${index}.reason`}
                                render={({ field }) => (
                                    <FormItem className='p-[10px]'>
                                        <FormLabel className='font-semibold'>Reason</FormLabel>
                                        <Input {...field} />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ))}
                <div className="flex space-x-4">

                    <div>
                        <Button type="button"
                            onClick={() => append({ item_id: '', inventory_id: '', quantity: 0, reason: '' })}>
                            <div className='bg-transparent shadow-sm hover:bg-transparent mr-[10px]'>
                                <PlusCircle size={18} />
                            </div>
                            <div>
                                Add Item
                            </div>

                        </Button>
                    </div>

                    <Button type="submit">
                        <div className='mr-[10px]'>
                            <Send size={15} />
                        </div>
                        <div>
                            Submit
                        </div>
                    </Button>

                </div>
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
            const formattedData = {
                ...data,
                items: data.items.map((item: LeftoverItem) => ({
                    inventory_id: item.inventory_id,
                    item_id: item.item_id,
                    quantity: item.quantity,
                    reason: item.reason
                }))
            };
            await leftoverService.postInventory(formattedData);
            await toast.promise(
                leftoverService.postInventory(data),
                {
                    loading: 'Submitting leftover...',
                    success: 'Leftover submitted successfully',
                    error: 'Failed to submit leftover'
                },
                {
                    duration: 3000
                }
            );
            setIsDialogOpen(false);
            const response = await leftoverService.fetchLeftovers(orderId);
            setLeftovers(response);
        } catch (error) {
            console.error('Error submitting leftover:', error);
            setError('Failed to submit leftover. Please try again.');
        }
    };

    const getItemName = (itemId: string) => {
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
                            <Button
                                className='ml-[10px]'>
                                Add Leftover
                            </Button>
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
                            <CardTitle className='ml-[10px]'>Left Over Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px]">
                                <Table className="w-full text-sm text-left rtl:text-right text-white">
                                    <TableHeader className="text-xs text-black uppercase bg-gray-100 shadow-md">
                                        <TableRow>
                                            <TableHead className="py-[30px] flex items-center"></TableHead>
                                            <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                                                <div className="flex items-center">
                                                    <Package className="mr-2" size={18} />
                                                    Item Name
                                                </div>
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                                                <div className="flex items-center">
                                                    <BarChart2 className="mr-2" size={18} />
                                                    Quantity
                                                </div>
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-[15px] text-black font-bold">
                                                <div className="flex items-center">
                                                    <AlertCircle className="mr-2" size={18} />
                                                    Reason
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leftovers && leftovers.flatMap((leftover) =>
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