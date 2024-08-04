import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Paper } from "../../../../Schema/erpSchema/paperTypeSchema";
import { getPapers, addPaper, updatePaper } from "../../../../services/erpServices/paperTypeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import ErpSidebar from "../../../_components/ErpSidebar";
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PaperComponent: React.FC = () => {
    const [editingData, setEditingData] = useState<Paper | null>(null);
    const [paperDataState, setPaperDataState] = useState<Paper[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();
    const form = useForm<Omit<Paper, 'paperId'>>();

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        try {
            const papers = await getPapers();
            setPaperDataState(papers);
        } catch (error) {
            console.error("Error fetching papers:", error);
        }
    };

    const handleAddPaper = async (data: Omit<Paper, 'paperId'>) => {
        try {
            await addPaper(data);
            await fetchPapers();
            setIsDialogOpen(false);
            form.reset();
        } catch (error) {
            console.error("Error adding paper:", error);
        }
    };

    const handleUpdate = async (id: number, updatedData: Omit<Paper, 'paperId'>) => {
        try {
            await updatePaper(id, updatedData);
            await fetchPapers();
        } catch (error) {
            console.error("Error updating paper:", error);
        }
    };

    const handleEdit = (data: Paper) => {
        setEditingData(data);
    };

    const handleSave = (row: Paper) => {
        const updatedData = {
            paperType: (document.getElementById(`paper_type_${row.paperId}`) as HTMLInputElement).value,
            rate: parseFloat((document.getElementById(`rate_${row.paperId}`) as HTMLInputElement).value),
            minThickness: parseFloat((document.getElementById(`min_thickness_${row.paperId}`) as HTMLInputElement).value),
            maxThickness: parseFloat((document.getElementById(`max_thickness_${row.paperId}`) as HTMLInputElement).value),
        };
        handleUpdate(row.paperId, updatedData);
        setEditingData(null);
    };

    return (
        <div className="flex h-screen bg-gray-100">
    <div className="flex-shrink-0">
        <ErpSidebar />
    </div>
    <div className="flex-grow overflow-auto">
        <div className="p-7 text-zinc-800">
            <div className="flex items-center justify-center mb-8">
                <h1 className="text-center text-4xl font-archivo font-semibold">Papers</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="ml-2 h-6 w-6 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>This page displays a list of paper types with their rates and thickness ranges. You can add, edit, and manage paper types here.</p>
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
                                <TableHead className="text-white">Paper Type</TableHead>
                                <TableHead className="text-white">Rate</TableHead>
                                <TableHead className="text-white">Min Thickness</TableHead>
                                <TableHead className="text-white">Max Thickness</TableHead>
                                <TableHead className="text-white">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paperDataState.map((row) => (
                                <TableRow key={row.paperId}>
                                    <TableCell className="truncate max-w-[50px]">{row.paperId}</TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperId === row.paperId ? (
                                            <Input
                                                id={`paper_type_${row.paperId}`}
                                                defaultValue={row.paperType}
                                                required
                                            />
                                        ) : (
                                            row.paperType
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperId === row.paperId ? (
                                            <Input
                                                id={`rate_${row.paperId}`}
                                                type="number"
                                                defaultValue={row.rate}
                                                required
                                            />
                                        ) : (
                                            row.rate
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperId === row.paperId ? (
                                            <Input
                                                id={`min_thickness_${row.paperId}`}
                                                type="number"
                                                defaultValue={row.minThickness}
                                                required
                                            />
                                        ) : (
                                            row.minThickness
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperId === row.paperId ? (
                                            <Input
                                                id={`max_thickness_${row.paperId}`}
                                                type="number"
                                                defaultValue={row.maxThickness}
                                                required
                                            />
                                        ) : (
                                            row.maxThickness
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingData && editingData.paperId === row.paperId ? (
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
                            <Button>Add Paper</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Paper Type</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleAddPaper)}>
                                    <FormField
                                        control={form.control}
                                        name="paperType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Paper Type</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Paper Type" required />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rate</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="Rate" required />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="minThickness"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Min Thickness</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="Min Thickness" required />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maxThickness"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Max Thickness</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" placeholder="Max Thickness" required />
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

export default PaperComponent;