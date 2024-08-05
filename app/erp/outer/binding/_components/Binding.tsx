'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Binding } from '../../../../Schema/erpSchema/bindingSchema';
import { getBindings, addBinding, updateBinding } from '../../../../services/erpServices/bindingService';
import ErpSidebar from '@/app/erp/_components/ErpSidebar';
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function BindingPage() {
  const [editingData, setEditingData] = useState<Binding | null>(null);
  const [bindingDataState, setBindingDataState] = useState<Binding[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBindings();
  }, []);

  const fetchBindings = async () => {
    try {
      const data = await getBindings();
      setBindingDataState(data);
    } catch (error) {
      console.error('Error fetching binding data:', error);
    }
  };

  const handleAddBinding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bindingData = {
      bindingType: formData.get('bindingType') as string,
      rate: parseFloat(formData.get('rate') as string),
    };

    try {
      await addBinding(bindingData);
      setIsDialogOpen(false);
      fetchBindings();
    } catch (error) {
      console.error('Error adding binding:', error);
    }
  };

  const handleUpdate = async (id: number, updatedData: Partial<Binding>) => {
    try {
      await updateBinding(id, updatedData);
      fetchBindings();
    } catch (error) {
      console.error('Error updating binding:', error);
    }
  };

  const handleEdit = (data: Binding) => {
    setEditingData(data);
  };

  const handleSave = (row: Binding) => {
    const updatedData = {
      bindingType: (document.getElementById(`binding_type_${row.id}`) as HTMLInputElement).value,
      rate: parseFloat((document.getElementById(`rate_${row.id}`) as HTMLInputElement).value),
    };
    handleUpdate(row.id, updatedData);
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
        <h1 className="text-4xl font-bold">Binding</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage binding types and rates for your printing projects.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#131527] hover:bg-[#131527]">
              <TableHead className="w-[15%] text-white text-center">S.N</TableHead>
              <TableHead className="w-[35%] text-white text-center">Binding Type</TableHead>
              <TableHead className="w-[25%] text-white text-center">Rate</TableHead>
              <TableHead className="w-[25%] text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bindingDataState.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-center">
                  <span className="truncate block w-[120px]" title={row.id.toString()}>
                    {row.id}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {editingData && editingData.id === row.id ? (
                    <Input
                      type="text"
                      id={`binding_type_${row.id}`}
                      defaultValue={row.bindingType}
                      required
                      className="w-full"
                    />
                  ) : (
                    <span>{row.bindingType}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editingData && editingData.id === row.id ? (
                    <Input
                      type="number"
                      id={`rate_${row.id}`}
                      defaultValue={row.rate}
                      required
                      className="w-full"
                    />
                  ) : (
                    <span>{row.rate}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editingData && editingData.id === row.id ? (
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
            <Button>Add Binding</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Binding Type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBinding}>
              <Input
                type="text"
                name="bindingType"
                placeholder="Binding Type"
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