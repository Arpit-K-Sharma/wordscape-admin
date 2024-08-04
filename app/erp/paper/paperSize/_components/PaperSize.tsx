import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { PaperSize } from "../../../../Schema/erpSchema/paperSizeSchema";
import { getPaperSizes, addPaperSize, updatePaperSize } from "../../../../services/erpServices/paperSizeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import ErpSidebar from "../../../_components/ErpSidebar";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PaperSizeComponent: React.FC = () => {
    const [editingData, setEditingData] = useState<PaperSize | null>(null);
    const [paperSizeDataState, setPaperSizeDataState] = useState<PaperSize[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();
    const form = useForm<Omit<PaperSize, 'paperSizeId'>>();

    useEffect(() => {
        fetchPaperSizes();
    }, []);

    const fetchPaperSizes = async () => {
        try {
            const paperSizes = await getPaperSizes();
            setPaperSizeDataState(paperSizes);
        } catch (error) {
            console.error("Error fetching paper sizes:", error);
        }
    };

    const handleAddPaperSize = async (data: Omit<PaperSize, 'paperSizeId'>) => {
        try {
            await addPaperSize(data);
            await fetchPaperSizes();
            setIsDialogOpen(false);
            form.reset();
        } catch (error) {
            console.error("Error adding paper size:", error);
        }
    };

    const handleUpdate = async (id: string, updatedData: Omit<PaperSize, 'paperSizeId'>) => {
        try {
            await updatePaperSize(id, updatedData);
            await fetchPaperSizes();
        } catch (error) {
            console.error("Error updating paper size:", error);
        }
    };

    const handleEdit = (data: PaperSize) => {
        setEditingData(data);
    };

    const handleSave = (row: PaperSize) => {
        const updatedData = {
            paperSize: (document.getElementById(`paper_size_${row.paperSizeId}`) as HTMLInputElement).value,
            dimensions: (document.getElementById(`dimensions_${row.paperSizeId}`) as HTMLInputElement).value,
            paperLength: parseFloat((document.getElementById(`paper_length_${row.paperSizeId}`) as HTMLInputElement).value),
            paperBreadth: parseFloat((document.getElementById(`paper_breadth_${row.paperSizeId}`) as HTMLInputElement).value),
        };
        handleUpdate(row.paperSizeId, updatedData);
        setEditingData(null);
    };

    return (
        <div className="flex h-screen bg-gray-100">
    <div className="flex-shrink-0">
        <ErpSidebar />
    </div>
    <div className="flex-grow overflow-auto">
        <div className="p-7 text-zinc-800">
            <div className="flex items-center justify-center mb-10">
                <h1 className="text-center text-4xl font-archivo font-semibold">Paper Size</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="ml-2 h-6 w-6 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>This page displays a list of paper sizes and their dimensions. You can add, edit, and manage paper sizes here.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex justify-center">
                <div className="w-11/12 bg-white rounded-lg shadow-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#131527] hover:bg-[#131527]">
                                <TableHead className="text-white">S.N</TableHead>
                                <TableHead className="text-white">Paper Size</TableHead>
                                <TableHead className="text-white">Dimensions</TableHead>
                                <TableHead className="text-white">Length (in)</TableHead>
                                <TableHead className="text-white">Breadth (in)</TableHead>
                                <TableHead className="text-white">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paperSizeDataState.map((row) => (
                                <TableRow key={row.paperSizeId}>
                                    <TableCell>{row.paperSizeId}</TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperSizeId === row.paperSizeId ? (
                                            <Input
                                                id={`paper_size_${row.paperSizeId}`}
                                                defaultValue={row.paperSize}
                                                required
                                            />
                                        ) : (
                                            row.paperSize
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperSizeId === row.paperSizeId ? (
                                            <Input
                                                id={`dimensions_${row.paperSizeId}`}
                                                defaultValue={row.dimensions}
                                                required
                                            />
                                        ) : (
                                            row.dimensions
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperSizeId === row.paperSizeId ? (
                                            <Input
                                                id={`paper_length_${row.paperSizeId}`}
                                                type="number"
                                                defaultValue={row.paperLength}
                                                step="0.1"
                                                required
                                            />
                                        ) : (
                                            row.paperLength
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperSizeId === row.paperSizeId ? (
                                            <Input
                                                id={`paper_breadth_${row.paperSizeId}`}
                                                type="number"
                                                defaultValue={row.paperBreadth}
                                                step="0.1"
                                                required
                                            />
                                        ) : (
                                            row.paperBreadth
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperSizeId === row.paperSizeId ? (
                                            <Button onClick={() => handleSave(row)}>Save</Button>
                                        ) : (
                                            <Button onClick={() => handleEdit(row)}>Edit</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                    </div>
                    <div className="mt-4 text-center">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Add Paper Size</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Paper Size</DialogTitle>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleAddPaperSize)}>
                                        <FormField
                                            control={form.control}
                                            name="paperSize"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Paper Size</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Paper Size" required />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dimensions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Dimensions</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Dimensions" required />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="paperLength"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Length (in)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="number" step="0.1" placeholder="Length" required />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="paperBreadth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Breadth (in)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="number" step="0.1" placeholder="Breadth" required />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="mt-4">Add</Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    
                </div>
            </div>
        </div>
        </div>
    );
};

export default PaperSizeComponent;