"use client";
import HRSidebar from "@/app/components/HRSidebar/hrsidebar";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiTrash2, FiX, FiEdit, FiCheck } from "react-icons/fi";
import {
  LeaveManagement,
  LeaveManagementService,
} from "@/app/services/hrServices/leaveManagementService";
import { staffService, Staff } from "@/app/services/hrServices/staffService";

const Leaves: React.FC = () => {
  const [leaveManagement, setLeaveManagement] = useState<LeaveManagement[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<Staff[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Staff | null>(null);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [leaveType, setLeaveType] = useState<string | undefined>(undefined);
  const [leaveStatus, setLeaveStatus] = useState<string>("Pending");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [calendarType, setCalendarType] = useState<"start" | "end">("start");
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [leaveToUpdate, setLeaveToUpdate] = useState<LeaveManagement | null>(
    null
  );
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [leaveToHandle, setLeaveToHandle] = useState<string>("");
  const [handleStatus, setHandleStatus] = useState<string>("");

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "Select date";
    if (date instanceof Date) return date.toISOString().split("T")[0];
    return date || "Select date";
  };

  interface LeaveResponse {
    data: LeaveManagement[];
  }
  useEffect(() => {
    fetchLeaveData();
    fetchEmployeeOptions();
  }, [leaveStatus]);

  useEffect(() => {
    console.log(leaveStatus);
  }, [setLeaveStatus, leaveStatus]);

  const fetchLeaveData = async () => {
    try {
      const data = await LeaveManagementService.getLeave();
      setLeaveManagement(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.log("Error fetching leave data", error);
    }
  };

  const addLeave = async () => {
    if (selectedEmployee && selectedEmployee._id && selectedEmployee.id) {
      const newLeave = {
        _id: selectedEmployee._id,
        staff_id: selectedEmployee.id, // Ensure staff_id is defined
        start_date: startDate
          ? new Date(startDate.getTime() + 86400000)
          : new Date(),
        end_date: endDate ? new Date(endDate.getTime() + 86400000) : new Date(),
        reason: leaveReason,
        type: leaveType || "", // Ensure type is a string
        status: leaveStatus, // Ensure status is a string
      };

      try {
        await LeaveManagementService.addLeave(newLeave.staff_id, newLeave);
        setSelectedEmployee(null);
        setStartDate(undefined);
        setEndDate(undefined);
        setLeaveReason("");
        setLeaveType(undefined);
        fetchLeaveData();
      } catch (error) {
        console.error("Error adding leave", error);
      }
    } else {
      console.error("Selected employee or staff ID is undefined");
    }
  };

  const fetchEmployeeOptions = async () => {
    try {
      const employees: Staff[] = await staffService.getStaff();
      setEmployeeOptions(Array.isArray(employees) ? employees : []);
    } catch (error) {
      console.log("Error fetching employees", error);
    }
  };

  const isRowDisabled = (status: string) => {
    return status === "Approved" || status === "Rejected";
  };

  const handleDateClick = (type: "start" | "end") => {
    setCalendarType(type);
    setIsCalendarDialogOpen(true);
  };

  const handleChange = (value: any) => {
    const filteredObject = employeeOptions.filter(
      (option) => option.id === value
    );
    console.log(filteredObject);
    if (filteredObject.length > 0) {
      console.log(filteredObject[0]);
      setSelectedEmployee(filteredObject[0]);
    } else {
      console.warn("No employee found with the given ID:", value);
    }
  };

  const handleLeave = async (leave_id: string, type: string) => {
    setIsApproveDialogOpen(true);
    setLeaveToHandle(leave_id);
    setHandleStatus(type);
  };

  const handleApproval = async () => {
    await LeaveManagementService.approveLeave(leaveToHandle);
    setLeaveStatus("Approved");
    handleClose();
  };

  const handleRejection = async () => {
    await LeaveManagementService.declineLeave(leaveToHandle);
    setLeaveStatus("Declined");
    handleClose();
  };

  const handleClose = async () => {
    setIsApproveDialogOpen(false);
    setLeaveToHandle("");
    setHandleStatus("");
  };

  const openUpdateDialog = (leave: LeaveManagement) => {
    setSelectedLeaveId(leave.id || null);
    setLeaveToUpdate(leave);
    handleChange(leave.staff_id || null);
    setStartDate(leave.start_date);
    setEndDate(leave.end_date);
    setLeaveReason(leave.reason);
    setLeaveType(leave.type);
    setLeaveStatus(leave.status);
    setIsUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedLeaveId(null);
    setLeaveToUpdate(null);
    setSelectedEmployee(null);
    setStartDate(undefined);
    setStartDate(undefined);
    setLeaveReason("");
    setLeaveType(undefined);
  };

  const handleUpdateLeave = async () => {
    if (
      selectedEmployee &&
      startDate &&
      endDate &&
      leaveType &&
      leaveReason &&
      selectedLeaveId
    ) {
      // Ensure selectedLeaveId is  available

      let start = startDate;
      let end = endDate;

      // Function to convert string date (DD-MM-YYYY) to Date object
      const convertStringToDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      };

      // Check if startDate and endDate are strings in DD-MM-YYYY format, if so, convert them to Date objects
      if (typeof startDate === "string" || startDate instanceof String) {
        start = convertStringToDate(startDate);
      }
      if (typeof endDate === "string" || endDate instanceof String) {
        end = convertStringToDate(endDate);
      }

      // Check if the converted dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("Invalid start date or end date:", { start, end });
        return;
      }

      if (selectedLeaveId && selectedEmployee?.id) {
        const updatedLeave = {
          _id: selectedLeaveId,
          staff_id: selectedEmployee.id,
          staff_name: selectedEmployee.fullName,
          start_date: new Date(start.getTime() + 86400000),
          end_date: new Date(end.getTime() + 86400000),
          reason: leaveReason,
          type: leaveType,
        };

        try {
          await LeaveManagementService.updateLeave(
            selectedLeaveId,
            updatedLeave
          );
          await fetchLeaveData();
          closeUpdateDialog();
        } catch (error) {
          console.error("Error updating leave:", error);
        }
      }
    }
  };

  return (
    <div className="flex">
      <HRSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Leave Management</h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>
              Add Leave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Leave</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Employee Name
                </Label>
                <Select
                  value={selectedEmployee?.fullName}
                  onValueChange={handleChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue style={{ color: "black" }}>
                      {selectedEmployee
                        ? selectedEmployee.fullName
                        : "Select employee"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {employeeOptions.map((employee) => (
                      <SelectItem
                        key={employee.fullName}
                        value={employee.id || ""}
                      >
                        {employee.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  value={formatDate(startDate)}
                  onClick={() => handleDateClick("start")}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  value={formatDate(endDate)}
                  onClick={() => handleDateClick("end")}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Cause
                </Label>
                <Input
                  id="leaveReason"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={addLeave}>Save Leave</Button>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isCalendarDialogOpen}
          onOpenChange={setIsCalendarDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Date</DialogTitle>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={calendarType === "start" ? startDate : endDate}
              onSelect={(date) => {
                if (calendarType === "start") {
                  setStartDate(date);
                } else {
                  setEndDate(date);
                }
                setIsCalendarDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {leaveManagement && leaveManagement.length > 0 ? (
          <Table className="w-full bg-white border border-grey-900 rounded-lg shadow-sm">
            <TableHeader>
              <TableRow className="bg-gray-800">
                <TableHead className="text-center py-3 px-4 text-white ">
                  Employee Name
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white">
                  Start Date
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white ">
                  End Date
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white ">
                  Cause
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white ">
                  Type
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white ">
                  Status
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white ">
                  Edit
                </TableHead>
                <TableHead className="text-center py-3 px-4 text-white">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveManagement &&
                leaveManagement.map((leave) => (
                  <TableRow key={leave.id} className="border-t border-grey-900">
                    <TableCell className="text-center py-2 px-4 ">
                      {leave.staff_name}
                    </TableCell>
                    <TableCell className="text-center py-2 px-4 ">
                      {leave.start_date}
                    </TableCell>
                    <TableCell className="text-center py-2 px-4 ">
                      {leave.end_date.split("T")[0]}
                    </TableCell>
                    <TableCell className="text-center py-2 px-4">
                      {leave.reason}
                    </TableCell>
                    <TableCell className="text-center py-2 px-4 ">
                      {leave.type}
                    </TableCell>
                    <TableCell className="text-center py-2 px-4 ">
                      {leave.status !== "Pending" ? (
                        leave.status === "Approved" ? (
                          <span className="w-24 inline-block font-bold text-green-500 text-center px-2 py-1">
                            {leave.status}
                          </span>
                        ) : (
                          <span className="w-24 inline-block font-bold text-red-500 text-center px-2 py-1">
                            {leave.status}
                          </span>
                        )
                      ) : (
                        <span className="w-24 inline-block font-bold text-yellow-500 text-center px-2 py-1">
                          {leave.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="flex justify-center ml-3 text-center py-2 px-4">
                      <Button
                        variant="outline"
                        onClick={() => openUpdateDialog(leave)}
                        disabled={isRowDisabled(leave.status)}
                        className="mr-3"
                      >
                        <FiEdit className="mr-2" />
                        Update
                      </Button>
                    </TableCell>
                    <TableCell className="text-center py-2 px-4">
                      <Button
                        onClick={() => {
                          if (leave.id) handleLeave(leave.id, "approve");
                        }}
                        disabled={isRowDisabled(leave.status)}
                        variant="outline"
                        className="mr-3 font-bold hover:text-success-foreground hover:bg-success-hover border border-solid border-slate-300"
                      >
                        <FiCheck className="mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (leave.id) handleLeave(leave.id, "reject");
                        }}
                        disabled={isRowDisabled(leave.status)}
                        className="mr-3 font-bold hover:text-warning-foreground hover:bg-warning-hover border border-solid border-slate-300"
                      >
                        <FiX className="mr-2" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <p>No Leaves Found</p>
        )}

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <p className="flex-1">Update Leave</p>
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Employee Name
                </Label>
                <Select
                  value={selectedEmployee?.fullName}
                  onValueChange={handleChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue style={{ color: "black" }}>
                      {selectedEmployee
                        ? selectedEmployee.fullName
                        : "Select employee"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {employeeOptions.map((employee) => (
                      <SelectItem
                        key={employee.fullName}
                        value={employee._id || ""}
                      >
                        {employee.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  value={formatDate(startDate)}
                  onClick={() => handleDateClick("start")}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  value={formatDate(endDate)}
                  onClick={() => handleDateClick("end")}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Cause
                </Label>
                <Input
                  id="leaveReason"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleUpdateLeave}>Update Leave</Button>
            <Button variant="secondary" onClick={closeUpdateDialog}>
              Cancel
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {handleStatus == "approve" ? "Approve Leave" : "Reject Leave"}
              </DialogTitle>
              <DialogDescription>
                {handleStatus == "approve"
                  ? "Are you sure you want to approve the leave ?"
                  : "Are you sure you want reject the leave ?"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              {handleStatus === "approve" ? (
                <Button
                  onClick={handleApproval}
                  className=" bg-success text-success-foreground hover:bg-success-hover"
                >
                  Approve
                </Button>
              ) : (
                <Button variant="destructive" onClick={handleRejection}>
                  Reject
                </Button>
              )}

              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Leaves;
