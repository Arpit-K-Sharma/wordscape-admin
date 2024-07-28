"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import InventorySidebar from '../Sidebar/InventorySidebar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BarChart2, Package } from "lucide-react";
import toast from 'react-hot-toast';
import { InventoryItem } from '../../Schema/inventorySchema';
import { Leftover } from '../../Schema/leftOverSchema';
import { leftoverService } from '@/app/services/inventoryServices/leftoverService';
import LeftoverForm from './leftOverForm';
import { inventoryService } from '@/app/services/inventoryServices/inventoryservice';

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
                    inventoryService.fetchInventory()
                ]);
                setLeftovers(leftoverResponse);
                setInventory(inventoryResponse);
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
                items: data.items.map((item: any) => ({
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
                <h1 className="text-2xl font-bold mb-4 mt-[20px]">
                    <a className='flex justify-between'>Leftovers Items <a className='flex justify-end text-[20px]'> #{orderId}</a></a>
                </h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className='ml-[10px]'>
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