'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet } from '../../../../Schema/erpSchema/sheetSchema';
import { getSheets, addSheet, updateSheet } from '../../../../services/erpServices/sheetService';
import ErpSidebar from '@/app/erp/_components/ErpSidebar';
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SheetsPage() {
  const [editingData, setEditingData] = useState<Sheet | null>(null);
  const [sheetDataState, setSheetDataState] = useState<Sheet[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    try {
      const data = await getSheets();
      setSheetDataState(data);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
    }
  };

  const handleAddSheet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sheetData = {
      sheetSize: formData.get('sheetSize') as string,
      sheetLength: parseInt(formData.get('sheetLength') as string, 10),
      sheetBreadth: parseInt(formData.get('sheetBreadth') as string, 10),
      value: parseInt(formData.get('value') as string, 10),
    };

    try {
      await addSheet(sheetData);
      setIsDialogOpen(false);
      fetchSheets();
    } catch (error) {
      console.error('Error adding sheet:', error);
    }
  };

  const handleUpdate = async (id: number, updatedData: Partial<Sheet>) => {
    try {
      await updateSheet(id, updatedData);
      fetchSheets();
    } catch (error) {
      console.error('Error updating sheet:', error);
    }
  };

  const handleEdit = (data: Sheet) => {
    setEditingData(data);
  };

  const handleSave = (row: Sheet) => {
    const updatedData = {
      sheetSize: (document.getElementById(`sheetSize_${row.sheetSizeId}`) as HTMLInputElement).value,
      sheetLength: parseInt((document.getElementById(`sheetLength_${row.sheetSizeId}`) as HTMLInputElement).value, 10),
      sheetBreadth: parseInt((document.getElementById(`sheetBreadth_${row.sheetSizeId}`) as HTMLInputElement).value, 10),
      value: parseInt((document.getElementById(`value_${row.sheetSizeId}`) as HTMLInputElement).value, 10),
    };
    handleUpdate(row.sheetSizeId, updatedData);
    setEditingData(null);
  };

  return (

    <div className="flex h-screen bg-gray-100">
      <div className="">
        <ErpSidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-7 text-zinc-800 max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-4xl font-bold text-archivo">Sheets</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage sheet sizes, dimensions, and values for your printing projects.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#131527] hover:bg-[#131527]">
                  <TableHead className="w-[10%] text-white text-center">S.N</TableHead>
                  <TableHead className="w-[20%] text-white text-center">Sheet Size</TableHead>
                  <TableHead className="w-[20%] text-white text-center">Sheet Length</TableHead>
                  <TableHead className="w-[20%] text-white text-center">Sheet Breadth</TableHead>
                  <TableHead className="w-[15%] text-white text-center">Value</TableHead>
                  <TableHead className="w-[15%] text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sheetDataState.map((row, index) => (
                  <TableRow key={row.sheetSizeId} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-center">
                      <span className="truncate block w-12" title={`${index + 1}`}>
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.sheetSizeId === row.sheetSizeId ? (
                        <Input
                          type="text"
                          id={`sheetSize_${row.sheetSizeId}`}
                          defaultValue={row.sheetSize}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.sheetSize}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.sheetSizeId === row.sheetSizeId ? (
                        <Input
                          type="number"
                          id={`sheetLength_${row.sheetSizeId}`}
                          defaultValue={row.sheetLength}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.sheetLength}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.sheetSizeId === row.sheetSizeId ? (
                        <Input
                          type="number"
                          id={`sheetBreadth_${row.sheetSizeId}`}
                          defaultValue={row.sheetBreadth}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.sheetBreadth}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.sheetSizeId === row.sheetSizeId ? (
                        <Input
                          type="number"
                          id={`value_${row.sheetSizeId}`}
                          defaultValue={row.value}
                          required
                          className="w-full"
                        />
                      ) : (
                        <span>{row.value}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      {editingData && editingData.sheetSizeId === row.sheetSizeId ? (
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
                <Button>Add Sheet</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Sheet Size</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSheet}>
                  <Input
                    type="text"
                    name="sheetSize"
                    placeholder="Sheet Size"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="sheetLength"
                    placeholder="Sheet Length"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="sheetBreadth"
                    placeholder="Sheet Breadth"
                    className="mt-5"
                    required
                  />
                  <Input
                    type="number"
                    name="value"
                    placeholder="Value"
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