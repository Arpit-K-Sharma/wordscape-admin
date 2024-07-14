"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HRSidebar from "@/app/components/HRSidebar/hrsidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Employee {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  created_at: string;
  dailyWage: number;
  departmentNames: string[];
  status: boolean;
  address: string;
  role: string;
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    position: "",
    dailyWage: 0,
    dept_ids: [],
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/staff");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddStaff = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/staff", newStaff);
      setIsAddStaffDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <HRSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Employees</h1>
        <Button onClick={() => setIsAddStaffDialogOpen(true)} className="mb-4">
          Add Staff
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Daily Wage</TableHead>
              <TableHead>Departments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee._id}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  {new Date(employee.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>Rs. {employee.dailyWage.toFixed(2)}</TableCell>
                <TableCell>{employee.departmentNames.join(", ")}</TableCell>
                <TableCell>{employee.status ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleViewDetails(employee)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                        <DialogDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p>
                                  <strong>Name:</strong>{" "}
                                  {selectedEmployee?.fullName}
                                </p>
                                <p>
                                  <strong>Email:</strong>{" "}
                                  {selectedEmployee?.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong>{" "}
                                  {selectedEmployee?.phoneNumber}
                                </p>
                                <p>
                                  <strong>Address:</strong>{" "}
                                  {selectedEmployee?.address}
                                </p>
                                <p>
                                  <strong>Role:</strong>{" "}
                                  {selectedEmployee?.role}
                                </p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader>
                                <CardTitle>Employment Details</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p>
                                  <strong>Position:</strong>{" "}
                                  {selectedEmployee?.position}
                                </p>
                                <p>
                                  <strong>Daily Wage:</strong> Rs.{" "}
                                  {selectedEmployee?.dailyWage.toFixed(2)}
                                </p>
                                <p>
                                  <strong>Departments:</strong>{" "}
                                  {selectedEmployee?.departmentNames.join(", ")}
                                </p>
                                <p>
                                  <strong>Date Joined:</strong>{" "}
                                  {new Date(
                                    selectedEmployee?.created_at || ""
                                  ).toLocaleDateString()}
                                </p>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  {selectedEmployee?.status
                                    ? "Active"
                                    : "Inactive"}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isAddStaffDialogOpen}
        onOpenChange={setIsAddStaffDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={newStaff.fullName}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, fullName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newStaff.password}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, password: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={newStaff.address}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, address: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={newStaff.phoneNumber}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, phoneNumber: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                value={newStaff.position}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, position: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dailyWage" className="text-right">
                Daily Wage
              </Label>
              <Input
                id="dailyWage"
                type="number"
                value={newStaff.dailyWage}
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
                    dailyWage: Number(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddStaff}>Add Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
