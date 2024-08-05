'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plate } from '../../../../Schema/erpSchema/platesSchema';
import { Ink } from '../../../../Schema/erpSchema/inkSchema';
import { getPlates, addPlate, updatePlate } from '../../../../services/erpServices/platesService';
import { getInks, addInk, updateInk } from '../../../../services/erpServices/inkService';
import ErpSidebar from '@/app/erp/_components/ErpSidebar';
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator"

export default function PlatePage() {
  const [editingData, setEditingData] = useState<Plate | null>(null);
  const [plateDataState, setPlateDataState] = useState<Plate[]>([]);
  const [inkDataState, setInkDataState] = useState<Ink[]>([]);
  const [editingInkData, setEditingInkData] = useState<Ink | null>(null);
  const [isPlateDialogOpen, setIsPlateDialogOpen] = useState(false);
  const [isInkDialogOpen, setIsInkDialogOpen] = useState(false);
  const router = useRouter();
  const [reload, setReload] = useState(1);

  useEffect(() => {
    fetchPlates();
    fetchInks();
  }, [reload]);

  const fetchPlates = async () => {
    try {
      const data = await getPlates();
      setPlateDataState(data);
    } catch (error) {
      console.error('Error fetching plate data:', error);
    }
  };

  const fetchInks = async () => {
    try {
      const data = await getInks();
      setInkDataState(data);
    } catch (error) {
      console.error('Error fetching ink data:', error);
    }
  };

  const handleAddPlate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const plateData = {
      plateSize: formData.get('plateSize') as string,
      plateLength: parseFloat(formData.get('plateLength') as string),
      plateBreadth: parseFloat(formData.get('plateBreadth') as string),
      plateRate: parseFloat(formData.get('plateRate') as string),
      inkRate: parseFloat(formData.get('inkRate') as string),
      reprint: parseFloat(formData.get('reprint') as string),
    };

    try {
      const newPlate = await addPlate(plateData);
      setIsPlateDialogOpen(false);
      setReload(prev => prev + 1);
    } catch (error) {
      console.error('Error adding plate:', error);
    }
  };

  const handleAddInk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inkData = {
      inkType: formData.get('inkType') as string,
    };

    try {
      await addInk(inkData);
      setIsInkDialogOpen(false);
      fetchInks();
    } catch (error) {
      console.error('Error adding ink:', error);
    }
  };

  const handleUpdatePlate = async (id: number, updatedData: Partial<Plate>) => {
    try {
      await updatePlate(id, updatedData);
      fetchPlates();
    } catch (error) {
      console.error('Error updating plate:', error);
    }
  };

  const handleUpdateInk = async (id: number, updatedData: Partial<Ink>) => {
    try {
      await updateInk(id, updatedData);
      fetchInks();
    } catch (error) {
      console.error('Error updating ink:', error);
    }
  };

  const handleEdit = (data: Plate) => {
    setEditingData(data);
  };

  const handleEditInk = (data: Ink) => {
    setEditingInkData(data);
  };

  const handleSave = (row: Plate) => {
    const updatedData = {
      plateSize: (document.getElementById(`plateSize_${row.id}`) as HTMLInputElement).value,
      plateLength: parseFloat((document.getElementById(`plateLength_${row.id}`) as HTMLInputElement).value),
      plateBreadth: parseFloat((document.getElementById(`plateBreadth_${row.id}`) as HTMLInputElement).value),
      plateRate: parseFloat((document.getElementById(`plateRate_${row.id}`) as HTMLInputElement).value),
      inkRate: parseFloat((document.getElementById(`inkRate_${row.id}`) as HTMLInputElement).value),
      reprint: parseFloat((document.getElementById(`reprint_${row.id}`) as HTMLInputElement).value)
    };
    handleUpdatePlate(row.id, updatedData);
    setEditingData(null);
  };

  const handleSaveInk = (row: Ink) => {
    const updatedData = {
      inkType: (document.getElementById(`inkType_${row.id}`) as HTMLInputElement).value,
    };
    handleUpdateInk(row.id, updatedData);
    setEditingInkData(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="">
        <ErpSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-7 text-zinc-800 max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl font-bold">Plate</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage plate sizes, dimensions, rates, and ink rates for your printing projects.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#131527] hover:bg-[#131527]">
                  <TableHead className="w-[10%] text-white text-center">S.N</TableHead>
                  <TableHead className="w-[15%] text-white text-center">Plate Size</TableHead>
                  <TableHead className="w-[15%] text-white text-center">Length</TableHead>
                  <TableHead className="w-[15%] text-white text-center">Breadth</TableHead>
                  <TableHead className="w-[15%] text-white text-center">Plate Rate</TableHead>
                  <TableHead className="w-[15%] text-white text-center">Ink Rate</TableHead>
                  <TableHead className="w-[15%] text-white text-center">Reprint</TableHead>
                  <TableHead className="w-[10%] text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plateDataState.sort((a, b) => a.id - b.id).map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center">
                      <span className="truncate block w-[120px]" title={row.id.toString()}>
                        {row.id}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.id === row.id ? (
                        <Input
                          type="text"
                          id={`plateSize_${row.id}`}
                          defaultValue={row.plateSize}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.plateSize}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.id === row.id ? (
                        <Input
                          type="number"
                          id={`plateLength_${row.id}`}
                          defaultValue={row.plateLength}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.plateLength}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.id === row.id ? (
                        <Input
                          type="number"
                          id={`plateBreadth_${row.id}`}
                          defaultValue={row.plateBreadth}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.plateBreadth}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.id === row.id ? (
                        <Input
                          type="number"
                          id={`plateRate_${row.id}`}
                          defaultValue={row.plateRate}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.plateRate}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.id === row.id ? (
                        <Input
                          type="number"
                          id={`inkRate_${row.id}`}
                          defaultValue={row.inkRate}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.inkRate}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.id === row.id ? (
                        <Input
                          type="number"
                          id={`reprint_${row.id}`}
                          defaultValue={row.reprint}
                          required
                          className="w-full"
                          step="0.01"
                        />
                      ) : (
                        <span>{row.reprint}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.id === row.id ? (
                        <Button onClick={() => handleSave(row)} className="w-full">Save</Button>
                      ) : (
                        <Button onClick={() => handleEdit(row)} className="w-full">Edit</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center mt-6">
            <Dialog open={isPlateDialogOpen} onOpenChange={setIsPlateDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Plate</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Plate Size</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPlate}>
                  <Input
                    type="text"
                    name="plateSize"
                    placeholder="Plate Size"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="plateLength"
                    placeholder="Plate Length"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="plateBreadth"
                    placeholder="Plate Breadth"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="plateRate"
                    placeholder="Plate Rate"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="inkRate"
                    placeholder="Ink Rate"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="reprint"
                    placeholder="Reprint"
                    className="mt-5"
                    required
                    step="0.01"
                  />
                  <Button type="submit" className="mt-5 w-full">Add</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="my-6" />
          <div className="mt-16">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-4xl font-bold">Ink Type</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manage ink types for your printing projects.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#131527] hover:bg-[#131527]">
                    <TableHead className="w-[20%] text-white text-center">S.N</TableHead>
                    <TableHead className="w-[60%] text-white text-center">Ink Type</TableHead>
                    <TableHead className="w-[20%] text-white text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inkDataState.sort((a, b) => a.id - b.id).map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-center">
                        <span className="truncate block w-[120px]" title={(index + 1).toString()}>
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className='text-center'>
                        {editingInkData && editingInkData.id === row.id ? (
                          <Input
                            type="text"
                            id={`inkType_${row.id}`}
                            defaultValue={row.inkType}
                            required
                            className="w-full"
                          />
                        ) : (
                          <span>{row.inkType}</span>
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        {editingInkData && editingInkData.id === row.id ? (
                          <Button onClick={() => handleSaveInk(row)} className="w-full">Save</Button>
                        ) : (
                          <Button onClick={() => handleEditInk(row)} className="w-[100px]">Edit</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center mt-6">
              <Dialog open={isInkDialogOpen} onOpenChange={setIsInkDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add Ink</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Ink Type</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddInk}>
                    <Input
                      type="text"
                      name="inkType"
                      placeholder="Ink Type"
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
    </div>
  );
}
