'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CoverTreatment } from '../../../../Schema/erpSchema/coverTreatmentSchema';
import { getCoverTreatments, addCoverTreatment, updateCoverTreatment } from '../../../../services/erpServices/coverTreatmentService';
import ErpSidebar from '@/app/erp/_components/ErpSidebar';
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CoverTreatmentPage() {
  const [editingData, setEditingData] = useState<CoverTreatment | null>(null);
  const [coverTreatmentData, setCoverTreatmentData] = useState<CoverTreatment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCoverTreatments();
  }, []);

  const fetchCoverTreatments = async () => {
    try {
      const data = await getCoverTreatments();
      setCoverTreatmentData(data);
    } catch (error) {
      console.error('Error fetching cover treatments data:', error);
    }
  };

  const handleAddCoverTreatment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const coverTreatmentData = {
      coverTreatmentType: formData.get('coverTreatmentType') as string,
      rate: parseFloat(formData.get('rate') as string),
    };

    try {
      await addCoverTreatment(coverTreatmentData);
      setIsDialogOpen(false);
      fetchCoverTreatments();
    } catch (error) {
      console.error('Error adding cover treatment:', error);
    }
  };

  const handleUpdate = async (id: number, updatedData: Partial<CoverTreatment>) => {
    try {
      await updateCoverTreatment(id, updatedData);
      fetchCoverTreatments();
    } catch (error) {
      console.error('Error updating cover treatment:', error);
    }
  };

  const handleEdit = (data: CoverTreatment) => {
    setEditingData(data);
  };

  const handleSave = (row: CoverTreatment) => {
    const updatedData = {
      coverTreatmentType: (document.getElementById(`cover_treatment_type_${row.coverTreatmentId}`) as HTMLInputElement).value,
      rate: parseFloat((document.getElementById(`rate_${row.coverTreatmentId}`) as HTMLInputElement).value),
    };
    handleUpdate(row.coverTreatmentId, updatedData);
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
            <h1 className="text-4xl font-bold">Cover Treatments</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage cover treatment types and rates for your printing projects.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#131527] hover:bg-[#131527]">
                  <TableHead className="w-[15%] text-white text-center">S.N</TableHead>
                  <TableHead className="w-[35%] text-white text-center">Cover Treatment Type</TableHead>
                  <TableHead className="w-[25%] text-white text-center">Rate</TableHead>
                  <TableHead className="w-[25%] text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coverTreatmentData.map((row) => (
                  <TableRow key={row.coverTreatmentId} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center" >
                      <span className="truncate block w-[120px]" title={row.coverTreatmentId.toString()}>
                        {row.coverTreatmentId}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {editingData && editingData.coverTreatmentId === row.coverTreatmentId ? (
                        <Input
                          type="text"
                          id={`cover_treatment_type_${row.coverTreatmentId}`}
                          defaultValue={row.coverTreatmentType}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.coverTreatmentType}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingData && editingData.coverTreatmentId === row.coverTreatmentId ? (
                        <Input
                          type="number"
                          id={`rate_${row.coverTreatmentId}`}
                          defaultValue={row.rate}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.rate}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.coverTreatmentId === row.coverTreatmentId ? (
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
                <Button>Add Cover Treatment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Cover Treatment Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCoverTreatment}>
                  <Input
                    type="text"
                    name="coverTreatmentType"
                    placeholder="Cover Treatment Type"
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