'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PaperThickness } from '../../../../Schema/erpSchema/paperThickness';
import { getPaperThicknesses, addPaperThickness, updatePaperThickness } from '../../../../services/erpServices/paperThicknessService';
import ErpSidebar from '@/app/erp/_components/ErpSidebar';
import { HelpCircle, InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function PaperThicknessPage() {
  const [editingData, setEditingData] = useState<PaperThickness | null>(null);
  const [paperThicknessDataState, setPaperThicknessDataState] = useState<PaperThickness[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPaperThicknesses();
  }, []);

  const fetchPaperThicknesses = async () => {
    try {
      const data = await getPaperThicknesses();
      setPaperThicknessDataState(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddPaperThickness = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const thickness = parseInt(formData.get('thickness') as string);

    try {
      await addPaperThickness(thickness);
      setIsDialogOpen(false);
      fetchPaperThicknesses();
    } catch (error) {
      console.error('Error adding paper thickness:', error);
    }
  };

  const handleUpdate = async (id: number, updatedData: Partial<PaperThickness>) => {
    try {
      await updatePaperThickness(id, updatedData);
      fetchPaperThicknesses();
    } catch (error) {
      console.error('Error updating paper thickness:', error);
    }
  };

  const handleEdit = (data: PaperThickness) => {
    setEditingData(data);
  };

  const handleSave = (row: PaperThickness) => {
    const updatedData = {
      thickness: parseInt((document.getElementById(`thickness_${row.thicknessId}`) as HTMLInputElement).value)
    };
    handleUpdate(row.thicknessId, updatedData);
    setEditingData(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="">
        <ErpSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-7 text-zinc-800 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl font-bold text-archivo">Paper Thicknesses</h1>
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#131527] hover:bg-[#131527]">
                  <TableHead className="w-1/4 text-white">ID</TableHead>
                  <TableHead className="w-1/2 text-white text-center">Thickness</TableHead>
                  <TableHead className="w-1/4 text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paperThicknessDataState.map((row) => (
                  <TableRow key={row.thicknessId} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <span className="truncate block w-[150px]" title={row.thicknessId.toString()}>
                        {row.thicknessId}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.thicknessId === row.thicknessId ? (
                        <Input
                          type="number"
                          id={`thickness_${row.thicknessId}`}
                          defaultValue={row.thickness}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.thickness}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.thicknessId === row.thicknessId ? (
                        <Button onClick={() => handleSave(row)} className="w-[100px]">Save</Button>
                      ) : (
                        <Button onClick={() => handleEdit(row)} className="w-[100px]">Edit</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center mt-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Paper Thickness</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Paper Thickness</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPaperThickness}>
                  <Input
                    type="number"
                    name="thickness"
                    placeholder="Thickness"
                    className="mt-5"
                    required
                  />
                  <Button type="submit" className="mt-5 w-full">Add</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}