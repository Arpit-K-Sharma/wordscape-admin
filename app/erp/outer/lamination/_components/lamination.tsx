'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lamination } from '../../../../Schema/erpSchema/laminationSchema';
import { getLaminations, addLamination, updateLamination } from '../../../../services/erpServices/laminationService';
import ErpSidebar from '@/app/erp/_components/ErpSidebar';
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export default function LaminationPage() {
  const [editingData, setEditingData] = useState<Lamination | null>(null);
  const [laminationData, setLaminations] = useState<Lamination[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchLaminations();
  }, []);

  const fetchLaminations = async () => {
    try {
      const data = await getLaminations();
      setLaminations(data);
    } catch (error) {
      console.error('Error fetching lamination data:', error);
    }
  };

  const handleAddLamination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const laminationData = {
      laminationType: formData.get('laminationType') as string,
      rate: parseFloat(formData.get('rate') as string),
    };

    try {
      await addLamination(laminationData);
      setIsDialogOpen(false);
      fetchLaminations();
    } catch (error) {
      console.error('Error adding lamination:', error);
    }
  };

  const handleUpdate = async (id: number, updatedData: Partial<Lamination>) => {
    try {
      await updateLamination(id, updatedData);
      fetchLaminations();
    } catch (error) {
      console.error('Error updating lamination:', error);
    }
  };

  const handleEdit = (data: Lamination) => {
    setEditingData(data);
  };

  const handleSave = (row: Lamination) => {
    const updatedData = {
      laminationType: (document.getElementById(`lamination_type_${row.laminationId}`) as HTMLInputElement).value,
      rate: parseFloat((document.getElementById(`rate_${row.laminationId}`) as HTMLInputElement).value),
    };
    handleUpdate(row.laminationId, updatedData);
    setEditingData(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="">
        <ErpSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-7 text-zinc-900 max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl font-bold">Laminations</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage lamination types and rates for your printing projects.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#131527] hover:bg-[#131527]">
                  <TableHead className="w-[15%] text-white text-center">ID</TableHead>
                  <TableHead className="w-[40%] text-white text-center">Lamination Type</TableHead>
                  <TableHead className="w-[25%] text-white text-center">Rate</TableHead>
                  <TableHead className="w-[20%] text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laminationData.map((row) => (
                  <TableRow key={row.laminationId} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center">
                      <span className="truncate block w-[120px" title={row.laminationId.toString()}>
                        {row.laminationId}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.laminationId === row.laminationId ? (
                        <Input
                          type="text"
                          id={`lamination_type_${row.laminationId}`}
                          defaultValue={row.laminationType}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.laminationType}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.laminationId === row.laminationId ? (
                        <Input
                          type="number"
                          id={`rate_${row.laminationId}`}
                          defaultValue={row.rate}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.rate}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.laminationId === row.laminationId ? (
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
                <Button>Add Lamination</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Lamination Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddLamination}>
                  <Input
                    type="text"
                    name="laminationType"
                    placeholder="Lamination Type"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="rate"
                    placeholder="Rate"
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