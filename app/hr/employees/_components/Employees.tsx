"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ToggleLeft, ToggleRight, ListCollapse, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

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

interface Department {
  _id: string;
  department_name: string;
  description: string;
}

const newStaffSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  status: z.boolean(),
  position: z.string().min(1, "Position is required"),
  dailyWage: z.number().positive("Daily wage must be a positive number"),
  dept_ids: z
    .array(z.string())
    .min(1, "At least one department must be selected"),
});

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newStaff, setNewStaff] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    status: true,
    position: "",
    dailyWage: "",
    dept_ids: [] as string[],
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/staff");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    }
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddStaff = async () => {
    try {
      const validatedData = newStaffSchema.parse(newStaff);
      const staffData = {
        ...validatedData,
        role: "ROLE_USER", // Default role
        status: true,
      };

      await axios.post("http://127.0.0.1:8000/staff", staffData);
      setIsAddStaffDialogOpen(false);
      fetchEmployees();
      toast.success("Staff added successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        console.error("Error adding staff:", error);
        toast.error("Failed to add staff");
      }
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/staff/${staffId}`);
        fetchEmployees();
        toast.success("Staff deleted successfully");
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error("Failed to delete staff");
      }
    }
  };

  const handleStatusChange = async (
    staffId: string,
    currentStatus: boolean
  ) => {
    try {
      if (currentStatus) {
        // Deactivate the employee
        await axios.post(`http://127.0.0.1:8000/staff/deactivate/${staffId}`, {
          status: false,
        });
      } else {
        // Reactivate the employee
        await axios.post(`http://127.0.0.1:8000/staff/reactivate/${staffId}`, {
          status: true,
        });
      }
      fetchEmployees(); // Refresh the employee list
      // toast.success(
      //   `Employee ${currentStatus ? "deactivated" : "reactivated"} successfully`
      // );
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("Failed to update employee status");
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Position</TableHead>

              <TableHead>Departments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>{employee.position}</TableCell>

                <TableCell>{employee.departmentNames.join(", ")}</TableCell>
                <TableCell>{employee.status ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center justify-center w-32"
                          onClick={() => handleViewDetails(employee)}
                        >
                          <ListCollapse className="mr-2 h-4 w-4" />
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
                                    {selectedEmployee?.role === "ROLE_USER"
                                      ? "Employee"
                                      : selectedEmployee?.role}
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
                                    {selectedEmployee?.departmentNames.join(
                                      ", "
                                    )}
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

                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center justify-center w-32"
                      onClick={() => handleDeleteStaff(employee._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Staff
                    </Button>

                    <Button
                      variant={employee.status ? "outline" : "default"}
                      size="sm"
                      className="flex items-center justify-center w-32"
                      onClick={() =>
                        handleStatusChange(employee._id, employee.status)
                      }
                    >
                      {employee.status ? (
                        <>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleRight className="mr-2 h-4 w-4" />
                          Reactivate
                        </>
                      )}
                    </Button>
                  </div>
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
                type="tel"
                value={newStaff.phoneNumber}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setNewStaff({ ...newStaff, phoneNumber: input });
                }}
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
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="status"
                value={newStaff.status.toString()}
                onChange={(e) =>
                  setNewStaff({
                    ...newStaff,
                    status: e.target.value === "true",
                  })
                }
                className="col-span-3"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div> */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departments" className="text-right">
                Departments
              </Label>
              <div className="col-span-3 space-y-2">
                {departments.map((dept) => (
                  <div key={dept._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dept-${dept._id}`}
                      checked={newStaff.dept_ids.includes(dept._id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewStaff({
                            ...newStaff,
                            dept_ids: [...newStaff.dept_ids, dept._id],
                          });
                        } else {
                          setNewStaff({
                            ...newStaff,
                            dept_ids: newStaff.dept_ids.filter(
                              (id) => id !== dept._id
                            ),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`dept-${dept._id}`}>
                      {dept.department_name}
                    </Label>
                  </div>
                ))}
              </div>
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
