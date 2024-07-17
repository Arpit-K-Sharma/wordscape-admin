"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { employeeService } from "@/app/services/hrServices/employeeService";
import {
  ToggleLeft,
  ToggleRight,
  ListCollapse,
  Trash2,
  Pencil,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
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
  password: string;
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
  position: z.string().min(1, "Position is required"),
  dailyWage: z.string().or(z.number()).transform(Number),
  dept_ids: z
    .array(z.string())
    .min(1, "At least one department must be selected"),
});

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    position: "",
    dailyWage: "",
    dept_ids: [],
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/department");
      setDepartments(response.data.data);
      console.log("testing ", JSON.stringify(response.data.data));
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    }
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddStaff = async () => {
    console.log("Add New Staff button pressed");
    console.log("Current newStaff state:", newStaff);

    try {
      console.log("Attempting to validate data with Zod schema");
      const validatedData = newStaffSchema.parse(newStaff);
      console.log("Data validated successfully:", validatedData);

      const staffData = {
        ...validatedData,
        role: "ROLE_USER",
        status: true,
        dailyWage: Number(validatedData.dailyWage),
      };
      console.log("Prepared staff data for API:", staffData);

      console.log("Calling employeeService.addEmployee");
      const result = await employeeService.addEmployee(staffData);
      console.log("API response:", result);

      setIsAddStaffDialogOpen(false);
      console.log("Add Staff dialog closed");

      await fetchEmployees();
      console.log("Employees list refreshed");

      toast.success("Staff added successfully");
      console.log("Success toast displayed");

      // Reset the form
      setNewStaff({
        fullName: "",
        email: "",
        password: "",
        address: "",
        phoneNumber: "",
        position: "",
        dailyWage: "",
        dept_ids: [],
      });
      console.log("New staff form reset");
    } catch (error) {
      console.error("Error in handleAddStaff:", error);

      if (error instanceof z.ZodError) {
        console.log("Zod validation errors:", error.errors);
        error.errors.forEach((err) => {
          toast.error(err.message);
          console.log("Error toast displayed:", err.message);
        });
      } else {
        console.error("Non-Zod error:", error);
        toast.error("Failed to add staff");
        console.log("General error toast displayed");
      }
    }
  };

  const handleDeleteStaff = (_id: string) => {
    setStaffToDelete(_id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStaff = async () => {
    if (staffToDelete) {
      try {
        await employeeService.deleteEmployee(staffToDelete);
        fetchEmployees();
        toast.success("Staff deleted successfully");
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error("Failed to delete staff");
      }
    }
    setIsDeleteDialogOpen(false);
    setStaffToDelete(null);
  };

  const handleStatusChange = async (
    staffId: string,
    currentStatus: boolean
  ) => {
    try {
      await employeeService.changeEmployeeStatus(staffId, !currentStatus);
      fetchEmployees();
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("Failed to update employee status");
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingEmployee) return;

    try {
      await employeeService.updateEmployee(editingEmployee.id, {
        fullName: editingEmployee.fullName,
        password: editingEmployee.password,
        email: editingEmployee.email,
        address: editingEmployee.address,
        phoneNumber: editingEmployee.phoneNumber,
        status: editingEmployee.status,
        position: editingEmployee.position,
        dailyWage: editingEmployee.dailyWage,
        dept_ids: editingEmployee.departmentNames
          .map(
            (name) =>
              departments.find((dept) => dept.department_name === name)?._id
          )
          .filter(Boolean) as string[],
      });

      toast.success("Employee updated successfully");
      setIsUpdateDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
    }
  };

  {
    console.log("DEPARTMENT CHECK", departments);
  }

  return (
    <div className="flex h-screen">
      <HRSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Employees</h1>
        <Button onClick={() => setIsAddStaffDialogOpen(true)} className="mb-4">
          <Plus className="mr-1 h-4 w-4" />
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
              <TableHead className="text-center">Actions</TableHead>
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
                <TableCell>
                  {employee.status ? (
                    <span style={{ fontWeight: "bold", color: "green" }}>
                      Active
                    </span>
                  ) : (
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      Inactive
                    </span>
                  )}
                </TableCell>
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
                      key={`update-${employee._id}`}
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-center w-32"
                      onClick={() => {
                        setEditingEmployee(employee);
                        setIsUpdateDialogOpen(true);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Update
                    </Button>
                    <Dialog
                      open={isUpdateDialogOpen}
                      onOpenChange={setIsUpdateDialogOpen}
                    >
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Update Employee</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updateFullName"
                              className="text-right"
                            >
                              Full Name
                            </Label>
                            <Input
                              id="updateFullName"
                              value={editingEmployee?.fullName || ""}
                              onChange={(e) =>
                                setEditingEmployee((prev) =>
                                  prev
                                    ? { ...prev, fullName: e.target.value }
                                    : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="updateEmail" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="updateEmail"
                              value={editingEmployee?.email || ""}
                              onChange={(e) =>
                                setEditingEmployee((prev) =>
                                  prev
                                    ? { ...prev, email: e.target.value }
                                    : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updatePassword"
                              className="text-right"
                            >
                              Password
                            </Label>
                            <Input
                              id="updatePassword"
                              type="password"
                              placeholder="Enter new password"
                              onChange={(e) =>
                                setEditingEmployee((prev) =>
                                  prev
                                    ? { ...prev, password: e.target.value }
                                    : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updateAddress"
                              className="text-right"
                            >
                              Address
                            </Label>
                            <Input
                              id="updateAddress"
                              value={editingEmployee?.address || ""}
                              onChange={(e) =>
                                setEditingEmployee((prev) =>
                                  prev
                                    ? { ...prev, address: e.target.value }
                                    : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updatePhoneNumber"
                              className="text-right"
                            >
                              Phone Number
                            </Label>
                            <Input
                              id="updatePhoneNumber"
                              value={editingEmployee?.phoneNumber || ""}
                              onChange={(e) =>
                                setEditingEmployee((prev) =>
                                  prev
                                    ? { ...prev, phoneNumber: e.target.value }
                                    : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updatePosition"
                              className="text-right"
                            >
                              Position
                            </Label>
                            <Input
                              id="updatePosition"
                              value={editingEmployee?.position || ""}
                              onChange={(e) =>
                                setEditingEmployee((prev) =>
                                  prev
                                    ? { ...prev, position: e.target.value }
                                    : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updateDailyWage"
                              className="text-right"
                            >
                              Daily Wage
                            </Label>
                            <Input
                              id="updateDailyWage"
                              type="number"
                              value={editingEmployee?.dailyWage || ""}
                              onChange={(e) =>
                                setEditingEmployee((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        dailyWage: Number(e.target.value),
                                      }
                                    : null
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updateStatus"
                              className="text-right"
                            >
                              Status
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setEditingEmployee((prev) =>
                                  prev
                                    ? { ...prev, status: value === "true" }
                                    : null
                                )
                              }
                              defaultValue={
                                editingEmployee?.status ? "true" : "false"
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="updateDepartments"
                              className="text-right"
                            >
                              Departments
                            </Label>
                            <div className="col-span-3 space-y-2">
                              {departments.map((dept) => (
                                <div
                                  key={dept.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`dept-${dept.id}`}
                                    checked={newStaff.dept_ids.includes(
                                      dept.id
                                    )}
                                    onCheckedChange={(checked) => {
                                      setNewStaff((prev) => ({
                                        ...prev,
                                        dept_ids: checked
                                          ? [...prev.dept_ids, dept.id]
                                          : prev.dept_ids.filter(
                                              (id) => id !== dept.id
                                            ),
                                      }));
                                    }}
                                  />
                                  <Label htmlFor={`dept-${dept.id}`}>
                                    {dept.department_name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleUpdateStaff}>
                            Update Employee
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={isDeleteDialogOpen}
                      onOpenChange={setIsDeleteDialogOpen}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this staff member?
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={confirmDeleteStaff}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      key={`delete-${employee.id}`}
                      variant="destructive"
                      size="sm"
                      className="flex items-center justify-center w-32"
                      onClick={() => handleDeleteStaff(employee.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Staff
                    </Button>

                    <Button
                      key={`status-${employee.id}`}
                      variant={employee.status ? "outline" : "default"}
                      size="sm"
                      className="flex items-center justify-center w-32"
                      onClick={() =>
                        handleStatusChange(employee.id, employee.status)
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departments" className="text-right">
                Departments
              </Label>
              <div className="col-span-3 space-y-2">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`updateDept-${dept.id}`}
                      checked={editingEmployee?.departmentNames.includes(
                        dept.department_name
                      )}
                      onCheckedChange={(checked) => {
                        setEditingEmployee((prev) => {
                          if (!prev) return null;
                          const newDepartments = checked
                            ? [...prev.departmentNames, dept.department_name]
                            : prev.departmentNames.filter(
                                (name) => name !== dept.department_name
                              );
                          return {
                            ...prev,
                            departmentNames: newDepartments,
                          };
                        });
                      }}
                    />
                    <Label htmlFor={`updateDept-${dept.id}`}>
                      {dept.department_name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddStaff}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
