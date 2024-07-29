"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  CheckCircle,
  CalendarPlus,
  DollarSign,
  Eye,
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
import { useRouter } from "next/navigation";

interface Employee {
  _id?: string;
  id?: string;
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
  dept_ids?: string[];
}

interface Department {
  id?: string;
  _id?: string;
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
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStaff, setNewStaff] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    position: "",
    dailyWage: 0,
    dept_ids: [] as string[],
  });

  const Router = useRouter();

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

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/department`);
      setDepartments(response.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    }
  };

  const filteredEmployees = useMemo(() => {
    if (searchTerm.length < 3) return employees;
    return employees.filter((employee) =>
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleAddStaff = async () => {
    try {
      const staffData = {
        fullName: newStaff.fullName,
        password: newStaff.password,
        email: newStaff.email,
        address: newStaff.address,
        phoneNumber: newStaff.phoneNumber,
        status: true,
        role: "ROLE_USER",
        position: newStaff.position,
        dailyWage: Number(newStaff.dailyWage),
        dept_ids: newStaff.dept_ids,
      };

      console.log("Sending staff data:", JSON.stringify(staffData, null, 2));

      await employeeService.addEmployee(staffData);
      setIsAddStaffDialogOpen(false);
      fetchEmployees();
      toast.success("Staff added successfully");

      // Reset the form
      setNewStaff({
        fullName: "",
        email: "",
        password: "",
        address: "",
        phoneNumber: "",
        position: "",
        dailyWage: 0,
        dept_ids: [],
      });
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff");
    }
  };

  // const handleDeleteStaff = (_id: string) => {
  //   setStaffToDelete(_id);
  //   setIsDeleteDialogOpen(true);
  // };

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
    staffId: string | undefined,
    currentStatus: boolean
  ) => {
    if (!staffId) return;
    try {
      await employeeService.changeEmployeeStatus(staffId, !currentStatus);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("Failed to update employee status");
    }
  };

  const handleUpdateStaff = async (id: string) => {
    if (!editingEmployee) return;
    try {
      const updatedEmployeeData: Partial<Employee> = {
        fullName: editingEmployee.fullName,
        email: editingEmployee.email,
        address: editingEmployee.address,
        phoneNumber: editingEmployee.phoneNumber,
        status: editingEmployee.status,
        position: editingEmployee.position,
        dailyWage: editingEmployee.dailyWage,
        dept_ids: editingEmployee.dept_ids,
      };
      if (editingEmployee.password) {
        updatedEmployeeData.password = editingEmployee.password;
      }
      console.log("Updating employee with ID:", id);
      console.log("Updated data:", updatedEmployeeData);
      await employeeService.updateEmployee(id, updatedEmployeeData);
      toast.success("Employee updated successfully");
      setIsUpdateDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
    }
  };

  return (
    <div className="flex h-screen">
      <HRSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Employees</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                {3 - searchTerm.length} more...
              </span>
            )}
          </div>
          <Button onClick={() => setIsAddStaffDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Staff
          </Button>
        </div>
        {employees.length > 0 ? (
          <Table className="w-full bg-white border border-grey-900 rounded-lg shadow-sm">
            <TableHeader>
              <TableRow className="bg-gray-800">
                <TableHead className="text-center py-3 px-4 text-white font-semibold">
                  Name
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white font-semibold">
                  Email
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white font-semibold">
                  Phone
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow
                  key={employee._id}
                  className="border-t border-grey-900"
                >
                  <TableCell className="text-center py-2 px-4 ">
                    {employee.fullName}
                  </TableCell>
                  <TableCell className="text-center py-2 px-4 ">
                    {employee.email}
                  </TableCell>
                  <TableCell className="text-center py-2 px-4 ">
                    {employee.phoneNumber}
                  </TableCell>

                  <TableCell className="text-center py-2 px-4 ">
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
                    <div className="flex justify-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-center pr-[3px]"
                            onClick={() => handleViewDetails(employee)}
                          >
                            <Eye className="mr-2 h-4 w-10 p-0" />
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

                              <div className="mt-4 flex justify-center space-x-8">
                                <Button
                                  className="flex items-center justify-center w-50 bg-blue-800 text-white rounded px-4 py-2 hover:bg-blue-700"
                                  onClick={() => {
                                    Router.push(
                                      `leave_history/${selectedEmployee?.id}`
                                    );
                                  }}
                                >
                                  <CalendarPlus className="mr-2 h-4 w-4" />
                                  Leave History
                                </Button>
                                <Button
                                  className="flex items-center justify-center w-50 bg-green-800 text-white rounded px-4 py-2 hover:bg-green-700"
                                  onClick={() => {
                                    Router.push(
                                      `attendance_history/${selectedEmployee?.id}`
                                    );
                                  }}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Attendance History
                                </Button>
                                <Button
                                  className="flex items-center justify-center w-50 bg-yellow-600 text-white rounded px-4 py-2 hover:bg-yellow-700"
                                  onClick={() => {
                                    Router.push(
                                      `payroll_history/${selectedEmployee?.id}`
                                    );
                                  }}
                                >
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Payroll History
                                </Button>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <Button
                        key={`update-${employee._id}`}
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center pr-[3px]"
                        onClick={() => {
                          console.log("Employee being edited:", employee);
                          setEditingEmployee({ ...employee });
                          setIsUpdateDialogOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-10 p-0" />
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
                              <Label
                                htmlFor="updateEmail"
                                className="text-right"
                              >
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
                                htmlFor="departments"
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
                                      id={`updateDept-${dept.id}`}
                                      checked={editingEmployee?.dept_ids?.includes(
                                        dept.id ?? ""
                                      )}
                                      onCheckedChange={(checked) => {
                                        setEditingEmployee((prev) => {
                                          if (!prev) return prev;
                                          const newDeptIds = checked
                                            ? [
                                                ...(prev.dept_ids || []),
                                                dept.id,
                                              ].filter(
                                                (id): id is string => id != null
                                              )
                                            : (prev.dept_ids || []).filter(
                                                (id) => id !== dept.id
                                              );
                                          return {
                                            ...prev,
                                            dept_ids: newDeptIds,
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
                            <Button
                              onClick={() => {
                                if (editingEmployee?.id) {
                                  handleUpdateStaff(editingEmployee.id);
                                } else {
                                  console.error("Employee ID is undefined");
                                  // Optionally, show an error message to the user
                                }
                              }}
                            >
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

                      {/* <Button
                      key={`delete-${employee.id}`}
                      variant="destructive"
                      size="sm"
                      className="flex items-center justify-center w-32"
                      onClick={() => handleDeleteStaff(employee.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Staff
                    </Button> */}

                      <Button
                        key={`status-${employee.id}`}
                        variant={employee.status ? "outline" : "default"}
                        size="sm"
                        className="flex items-center justify-center w-28"
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
        ) : (
          <p>No Employees Found</p>
        )}
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
                      id={`newDept-${dept.id}`}
                      checked={newStaff.dept_ids.includes(dept.id ?? "")}
                      onCheckedChange={(checked) => {
                        setNewStaff((prev) => {
                          const newDeptIds = checked
                            ? [...prev.dept_ids, dept.id].filter(
                                (id): id is string => id != null
                              )
                            : prev.dept_ids.filter((id) => id !== dept.id);
                          return { ...prev, dept_ids: newDeptIds };
                        });
                      }}
                    />
                    <Label htmlFor={`newDept-${dept.id}`}>
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
              Add New Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
