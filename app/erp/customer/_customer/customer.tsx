'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '../../../Schema/erpSchema/customerSchema';
import { getCustomers, addCustomer, deactivateCustomer } from '../../../services/erpServices/customerService';
import ErpSidebar from '../../_components/ErpSidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, HelpCircle } from 'lucide-react';

export default function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [page, setPage] = useState(0);
    const [pageLimit, setPageLimit] = useState(0);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers(page);
            setCustomers(data.response);
            setPageLimit(Math.ceil(data.totalElements / 10) - 1);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleAddCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const customerData = {
            userId: formData.get('userId') as string,
            fullName: formData.get('fullName') as string,
            address: formData.get('address') as string,
            email: formData.get('email') as string,
            companyName: formData.get('companyName') as string,
            status: formData.get('status') === 'true',
        };

        try {
            await addCustomer(customerData);
            setIsAddDialogOpen(false);
            fetchCustomers();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const handleDelete = async () => {
        if (deleteCustomerId) {
            try {
                await deactivateCustomer(deleteCustomerId);
                setIsDeleteDialogOpen(false);
                fetchCustomers();
            } catch (error) {
                console.error('Error deactivating customer:', error);
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-shrink-0">
                <ErpSidebar />
            </div>
            <div className="flex-grow p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center mb-8">
                        <h1 className="text-4xl font-bold">Customers</h1>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="ml-2 h-5 w-5 text-gray-500 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>This page displays a list of all customers and allows you to manage them.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-[#131527] hover:bg-[#131527]'>
                                    <TableHead className='text-white'>Customer ID</TableHead>
                                    <TableHead className='text-white'>Full Name</TableHead>
                                    <TableHead className='text-white'>Address</TableHead>
                                    <TableHead className='text-white'>Email</TableHead>
                                    <TableHead className='text-white'>Company Name</TableHead>
                                    <TableHead className='text-white'>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((customer) => (
                                    <TableRow key={customer.customerId}>
                                        <TableCell className="truncate max-w-[100px]">{customer.userId}</TableCell>
                                        <TableCell>{customer.fullName}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.companyName || "N/A"}</TableCell>
                                        <TableCell>
                                            {customer.status ? (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setDeleteCustomerId(customer.customerId);
                                                        setIsDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                'Inactive'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-center mt-4 space-x-2">
                        <Button
                            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                            disabled={page === 0}
                        >
                            Previous
                        </Button>
                        <span className="py-2">Page {page + 1}</span>
                        <Button
                            onClick={() => setPage((prev) => Math.min(pageLimit, prev + 1))}
                            disabled={page === pageLimit}
                        >
                            Next
                        </Button>
                    </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="mt-4">Add Customer</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Customer</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddCustomer}>
                            <Input name="fullName" placeholder="Full Name" className="mt-4" />
                            <Input name="address" placeholder="Address" className="mt-4" />
                            <Input name="email" type="email" placeholder="Email" className="mt-4" />
                            <Input name="companyName" placeholder="Company Name" className="mt-4" />
                            <Select name="status">
                                <SelectTrigger className="mt-4">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" className="mt-4">Add</Button>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Do you really want to delete this customer?</p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        </div>
    );
}