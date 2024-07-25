"use client";
import HRSidebar from '@/app/components/HRSidebar/hrsidebar';
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";

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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { FiTrash2, FiX} from "react-icons/fi";
import { PayrollService, Payroll } from '@/app/services/hrServices/payrollService';

const Payrolls: React.FC = () => {
  const [payrollManagement, setPayrollManagement] = useState<Payroll[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [filteredPayroll, setFilteredPayroll] = useState<Payroll[]>([]);
  const [payrollToDelete, setPayrollToDelete] = useState<Payroll | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);



  useEffect(() => {
    fetchPayrollData();
  }, [])


  useEffect(() => {
    if (selectedMonth && selectedMonth !== "all") {
      const filtered = payrollManagement.filter(payroll => payroll.month === selectedMonth);
      setFilteredPayroll(filtered);
    } else {
      setFilteredPayroll(payrollManagement);
    }
  }, [selectedMonth, payrollManagement]);

  const fetchPayrollData = async () => {
    try {
      const data = await PayrollService.listPayrolls();
      setPayrollManagement(data);
      setFilteredPayroll(data);
    }
    catch (error) {
      console.log("Error fetching payroll data", error);
    }
  }


  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  }

  const months = [
    { value: "all", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const openDeleteDialog = (payroll: Payroll) => {
    setPayrollToDelete(payroll);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setPayrollToDelete(null);
  };

  const handleDelete = async () => {
    if(payrollToDelete){
    try {
      await PayrollService.deletePayroll(payrollToDelete.id);
      fetchPayrollData();
      closeDeleteDialog();
    } catch (error) {
      console.log("Error deleting payroll", error);
    }
  }
  };


  return (
    <div className="flex h-screen">
      <HRSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Payroll Management</h1>
        <div className="flex justify-between items-center mb-4">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {payrollManagement.length > 0 ? (
          <>
            <Table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-center py-2 px-4">Employee Name</TableHead>
                  <TableHead className="text-center py-2 px-4">Month</TableHead>
                  <TableHead className="text-center py-2 px-4">Working Days</TableHead>
                  <TableHead className="text-center py-2 px-4">Paid Leaves</TableHead>
                  <TableHead className="text-center py-2 px-4">Holidays</TableHead>
                  <TableHead className="text-center py-2 px-4">Weekends</TableHead>
                  <TableHead className="text-center py-2 px-4">Daily Wage</TableHead>
                  <TableHead className="text-center py-2 px-4">Sub Total</TableHead>
                  <TableHead className="text-center py-2 px-4">Tax</TableHead>
                  <TableHead className="text-center py-2 px-4">Net Salary</TableHead>
                  <TableHead className="text-center py-2 px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayroll.map((payroll) => (
                  <TableRow key={payroll.id} className="border-t border-gray-200">
                    <TableCell className="text-center py-2 px-4">{payroll.staff_name}</TableCell>
                    <TableCell className="text-center py-2 px-4">{months.filter((month) => month.value == payroll.month)
                      .map((month) => month.label)}
                    </TableCell>
                    <TableCell className="text-center py-2 px-4">{payroll.working_days}</TableCell>
                    <TableCell className="text-center py-2 px-4">{payroll.paid_leaves}</TableCell>
                    <TableCell className="text-center py-2 px-4">{payroll.holidays}</TableCell>
                    <TableCell className="text-center py-2 px-4">{payroll.weekends}</TableCell>
                    <TableCell className="text-center py-2 px-4">{payroll.daily_wage}</TableCell>
                    <TableCell className="text-center py-2 px-4">Rs. {payroll.sub_total}</TableCell>
                    <TableCell className="text-center py-2 px-4">Rs. {payroll.tax}</TableCell>
                    <TableCell className="text-center py-2 px-4">Rs. {payroll.net_salary}</TableCell>
                    <TableCell>
                      <Button
                      variant="destructive"
                      onClick={() => {openDeleteDialog(payroll)}}
                      className="mr-3 font-bold flex justify-center ml-3 text-center"
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </Button>
                </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredPayroll.length === 0 && (
              <p className="mt-4 text-center">No payroll data found for the selected month.</p>
            )}
          </>
        ) : (
          <p>No Payroll Data Found</p>
        )}


    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Delete Holiday</DialogTitle>
                  <DialogDescription>
                      Are you sure you want to delete this Payroll? This action cannot
                      be undone.
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                  <Button variant="destructive" onClick={handleDelete}>
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
      </main>
    </div>
  );
}

export default Payrolls;