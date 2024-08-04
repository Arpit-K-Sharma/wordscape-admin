'use client';

import React, { useEffect, useState } from 'react';
import { User, UserFormData } from '../../../Schema/erpSchema/userSchema';
import { getUsers, addUser, updateUser } from '../../../services/erpServices/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ErpSidebar from '../../_components/ErpSidebar';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
});

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditChange = (field: keyof User, value: string) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleSave = async (userId: string) => {
    try {
      await updateUser(userId, editData);
      setEditingUserId(null);
      setEditData({});
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAddUser = async (data: UserFormData) => {
    try {
      await addUser(data);
      setIsAddUserDialogOpen(false);
      form.reset();
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <ErpSidebar />
      </div>
      <div className="flex-grow overflow-auto">
        <div className="p-7 text-black">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-center text-4xl font-archivo font-semibold">Staffs</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="ml-2 h-6 w-6  text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This page displays a list of all staff members and allows you to manage them.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-center">
            <div className="w-5/6 bg-white rounded-lg shadow-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#131527] hover:bg-[#131527]">
                    <TableHead className="w-[50px] text-white">User ID</TableHead>
                    <TableHead className="w-[80px] text-white">Email</TableHead>
                    <TableHead className="w-[80px] text-white">Password</TableHead>
                    <TableHead className="w-[80px] text-white">Status</TableHead>
                    <TableHead className="w-[10px] text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="truncate max-w-[80px]">{user.userId}</TableCell>
                      <TableCell>
                        {editingUserId === user.userId ? (
                          <Input
                            type="email"
                            defaultValue={user.email}
                            onChange={(e) => handleEditChange('email', e.target.value)}
                          />
                        ) : (
                          user.email
                        )}
                      </TableCell>
                      <TableCell>******</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell>
                        {editingUserId === user.userId ? (
                          <Button onClick={() => handleSave(user.userId)}>Save</Button>
                        ) : (
                          <Button onClick={() => {
                            setEditingUserId(user.userId);
                            setEditData({ email: user.email });
                          }}>Edit</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Staffs</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Users</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
