"use client";
import React, { useState } from "react";
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
} from "@/components/ui/dialog";

const employees = [
  {
    staff_id: "101",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    position: "HR Manager",
    date_joined: "2020-01-15",
    daily_wage: 1500,
    department_id: "1",
    status: true,
  },
];

const EmployeesPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="flex h-screen">
      <HRSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Employees</h1>
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
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.staff_id}>
                <TableCell>{employee.staff_id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.date_joined}</TableCell>
                <TableCell>Rs. {employee.daily_wage.toFixed(2)}</TableCell>
                <TableCell>Department {employee.department_id}</TableCell>
                <TableCell>{employee.status ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mr-2">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                        <DialogDescription>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
                            <div className="bg-white  shadow-md rounded-md p-4">
                              <h3 className="text-lg font-bold mb-2">
                                Payroll
                              </h3>
                              <p>
                                <strong>Monthly Salary:</strong> Rs.{" "}
                                {selectedEmployee?.daily_wage * 30}
                              </p>
                              <p>
                                <strong>Allowances:</strong>
                              </p>
                              <p>
                                <strong>Deductions:</strong>
                              </p>
                              <br />
                              <p className="underline">View Payroll Details</p>
                            </div>
                            <div className="bg-white shadow-md rounded-md p-4">
                              <h3 className="text-lg font-bold mb-2">
                                Attendance History
                              </h3>
                              <p>
                                <strong>Total Days Present:</strong> 20 days
                              </p>
                              <p>
                                <strong>Total Days Absent:</strong> 2 days
                              </p>
                              <p>
                                <strong>Late Arrivals:</strong> 5 times
                              </p>
                              <br />
                              <p className="underline">
                                View Attendance Details
                              </p>
                            </div>
                            <div className="bg-white shadow-md rounded-md p-4">
                              <h3 className="text-lg font-bold mb-2">
                                Leave Details
                              </h3>
                              <p>
                                <strong>Total Leaves Taken:</strong> 5 days
                              </p>
                              <p>
                                <strong>Remaining Leaves:</strong> 15 days
                              </p>

                              <br />
                              <p className="underline">View Leave Details</p>
                            </div>
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
    </div>
  );
};

export default EmployeesPage;
