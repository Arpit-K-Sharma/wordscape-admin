"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import HRSidebar from "@/app/components/HRSidebar/hrsidebar";
import {
  departmentService,
  Department,
} from "@/app/services/hrServices/departmentService";

function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState<Omit<Department, "_id">>({
    department_name: "",
    description: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);

  const openUpdateDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedDepartment(null);
  };

  const openDeleteDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleAddDepartment = async () => {
    try {
      await departmentService.addDepartment(newDepartment);
      await fetchDepartments();
      closeAddDialog();
      setNewDepartment({ department_name: "", description: "" });
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleUpdateDepartment = async () => {
    if (selectedDepartment) {
      try {
        await departmentService.updateDepartment(selectedDepartment._id, {
          department_name: selectedDepartment.department_name,
          description: selectedDepartment.description,
        });
        await fetchDepartments();
        closeUpdateDialog();
      } catch (error) {
        console.error("Error updating department:", error);
      }
    }
  };

  const handleDeleteDepartment = async () => {
    if (selectedDepartment) {
      try {
        await departmentService.deleteDepartment(selectedDepartment._id);
        await fetchDepartments();
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-white-50">
      <HRSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-5 py-8 font-archivo">
          <h1 className="flex items-center justify-center text-5xl font-bold text-gray-900 mb-8 mx-auto">
            Departments
          </h1>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={openAddDialog}>Add Department</Button>
          </div>

          <Table>
            <TableCaption>A list of departments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department._id}>
                  <TableCell>{department.department_name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => openUpdateDialog(department)}
                    >
                      <FiEdit2 className="mr-1" /> Update
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => openDeleteDialog(department)}
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </Button>
                  </TableCell> 
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add Department Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newDepartment.department_name}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        department_name: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newDepartment.description}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddDepartment}>Add Department</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Update Department Dialog */}
          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Department</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="update-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="update-name"
                    value={selectedDepartment?.department_name || ""}
                    onChange={(e) =>
                      setSelectedDepartment(
                        selectedDepartment
                          ? {
                              ...selectedDepartment,
                              department_name: e.target.value,
                            }
                          : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="update-description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="update-description"
                    value={selectedDepartment?.description || ""}
                    onChange={(e) =>
                      setSelectedDepartment(
                        selectedDepartment
                          ? {
                              ...selectedDepartment,
                              description: e.target.value,
                            }
                          : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateDepartment}>
                  Update Department
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Department Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Department</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this department? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDeleteDepartment}>
                  <FiTrash2 className="mr-2" />
                  Delete
                </Button>
                <Button variant="secondary" onClick={closeDeleteDialog}>
                  <FiX className="mr-2" />
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}

export default Departments;
