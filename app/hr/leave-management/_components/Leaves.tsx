"use client";
import HRSidebar from '@/app/components/HRSidebar/hrsidebar';
import React, { useState, useEffect } from 'react'
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
import { LeaveManagement, LeaveManagementService } from '@/app/services/hrServices/leaveManagementService';
import { staffService, Staff } from '@/app/services/hrServices/staffService';

const Leaves: React.FC = () => {
  const [leaveManagement, setLeaveManagement] = useState<LeaveManagement[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<any[]>([]); // State for employee options
  const [selectedEmployee, setSelectedEmployee] = useState<Staff | null>({fullName:"Select Your Employee"});
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [leaveType, setLeaveType] = useState<string | undefined>(undefined);
  const [leaveStatus, setLeaveStatus] = useState<string>("Pending");
  const [leaveReason, setLeaveReason] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [calendarType, setCalendarType] = useState<'start' | 'end'>('start');
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const[leaveToUpdate, setLeaveToUpdate] = useState<LeaveManagement | null>(null);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const[leaveToHandle,  setLeaveToHandle] = useState<string>("");
  const[handleStatus,  setHandleStatus] = useState<string>("");

  useEffect(() => {
    fetchLeaveData();
    fetchEmployeeOptions();
  }, [leaveStatus]); 


  useEffect(() =>{
    console.log(leaveStatus);
  },[setLeaveStatus,leaveStatus])

  const fetchLeaveData = async () => {
    try {
      const data = await LeaveManagementService.getLeave();
      setLeaveManagement(data.data);
    } catch (error) {
      console.log("Error fetching leave data", error);
    }
  };
  
  const addLeave = async() => {
    if (selectedEmployee && startDate && endDate && leaveType && leaveReason) {

      const newLeave = {
        staff_id: selectedEmployee.id,
        start_date: new Date(startDate.getTime() + 86400000)
          .toISOString()
          .split("T")[0],
        end_date: new Date(endDate.getTime() + 86400000)
        .toISOString()
        .split("T")[0],
        reason: leaveReason,
        type: leaveType,
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
    }
  };

  const fetchEmployeeOptions = async () => {
    try {
      const employees = await staffService.getStaff(); 
      console.log(employees.data);
      setEmployeeOptions(employees.data);
    } catch (error) {
      console.log('Error fetching employees', error);
    }
  };

  const handleDateClick = (type: 'start' | 'end') => {
    setCalendarType(type);
    setIsCalendarDialogOpen(true);
  };

  const handleChange = (value: any) => {
    const filteredObject = employeeOptions.filter((option) => option.id === value);
    console.log(filteredObject);
    if (filteredObject.length > 0) {
        console.log(filteredObject[0]);
        setSelectedEmployee(filteredObject[0]);
    } else {
        console.warn("No employee found with the given ID:", value);
    }
};

const handleLeave = async(leave_id: string, type:string) =>{
  setIsApproveDialogOpen(true);
  setLeaveToHandle(leave_id);
  setHandleStatus(type);
};


const handleApproval = async() =>{
  await LeaveManagementService.approveLeave(leaveToHandle);
  setLeaveStatus("Approved");
  handleClose();
};

const handleRejection = async()=>{
  await LeaveManagementService.declineLeave(leaveToHandle);
  setLeaveStatus("Declined");
  handleClose();
};

const handleClose= async() =>{
  setIsApproveDialogOpen(false);
  setLeaveToHandle("");
  setHandleStatus("");
};

  const openUpdateDialog = (leave: LeaveManagement) => {
    setSelectedLeaveId(leave.id);
    setLeaveToUpdate(leave);
    handleChange(leave.staff_id);
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
    if (selectedEmployee && startDate && endDate && leaveType && leaveReason && selectedLeaveId) { // Ensure selectedLeaveId is available
      const updatedLeave = {
        staff_id: selectedEmployee.id,
        staff_name: selectedEmployee.fullName,
        start_date: new Date(startDate.getTime() + 86400000)
        .toISOString()
        .split("T")[0],
        end_date: new Date(endDate.getTime() + 86400000)
        .toISOString()
        .split("T")[0],
        reason: leaveReason,
        type: leaveType,
      };
  
      try {
        await LeaveManagementService.updateLeave(selectedLeaveId, updatedLeave); 
        await fetchLeaveData(); 
        closeUpdateDialog(); 
      } catch (error) {
        console.error("Error updating leave:", error);
      }
    }
  };
 


  return (
    <div className="flex h-screen">
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
                  <SelectValue style={{ color: 'black' }}>{selectedEmployee ? selectedEmployee.fullName : 'Select employee'}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {employeeOptions.map((employee) => (
                      <SelectItem key={employee.fullName} value={employee.id}>
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
                  value={startDate? startDate : "Select date"}
                  onClick={() => handleDateClick('start')}
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
                  value={endDate? endDate : "Select date"}
                  onClick={() => handleDateClick('end')}
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
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='type' className='text-right'>
                  Type
                </Label>
                <Select
                  value={leaveType}
                  onValueChange={setLeaveType}
                >
                  <SelectTrigger className='col-span-3'>
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

        <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Date</DialogTitle>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={calendarType === 'start' ? startDate : endDate}
              onSelect={date => {
                if (calendarType === 'start') {
                  
                  setStartDate(date);
                } else {
                  
                  setEndDate(date);
                }
                setIsCalendarDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>


        {leaveManagement && leaveManagement.length > 0 ?(
          <Table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-center py-2 px-4">Employee Name</TableHead>
              <TableHead className="text-center py-2 px-4">Start Date</TableHead>
              <TableHead className="text-center py-2 px-4">End Date</TableHead>
              <TableHead className="text-center py-2 px-4">Cause</TableHead>
              <TableHead className="text-center py-2 px-4">Type</TableHead>
              <TableHead className="text-center py-2 px-4">Status</TableHead>
              <TableHead className="text-center py-2 px-4">Edit</TableHead>
              <TableHead className="text-center py-2 px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveManagement && leaveManagement.map((leave) => (
              <TableRow key={leave.id} className="border-t border-gray-200">
                <TableCell className="text-center py-2 px-4">{leave.staff_name}</TableCell>
                <TableCell className="text-center py-2 px-4">{leave.start_date}</TableCell>
                <TableCell className="text-center py-2 px-4">{leave.end_date}</TableCell>
                <TableCell className="text-center py-2 px-4">{leave.reason}</TableCell>
                <TableCell className="text-center py-2 px-4">{leave.type}</TableCell>
                <TableCell className="text-center py-2 px-4">
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
                    className="mr-3"
                  >
                    <FiEdit className="mr-2" />
                    Update
                  </Button>
                </TableCell>
                <TableCell className="text-center py-2 px-4">
                  <Button
                    onClick={() => handleLeave(leave.id,"approve")}
                    className="mr-3 bg-success font-bold text-success-foreground hover:bg-success-hover"
                  >
                    <FiCheck className="mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleLeave(leave.id,"reject")}
                    className="mr-3 font-bold"
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
              <DialogTitle className='flex items-center'>
              <p className="flex-1">Update Leave</p>
              {leaveStatus && (
                <>
                  {leaveStatus === "Pending" && (
                    <p className="mr-3 border-2 border-yellow-500 text-yellow-600 px-2 py-1 rounded">
                      {leaveStatus}
                    </p>
                  )}
                  {leaveStatus === "Approved" && (
                    <p className="mr-3 border-2 border-green-500 text-green-600 px-2 py-1 rounded">
                      {leaveStatus}
                    </p>
                  )}
                  {leaveStatus === "Rejected" && (
                    <p className="mr-3 border-2 border-red-500 text-red-600 px-2 py-1 rounded">
                      {leaveStatus}
                    </p>
                  )}
                </>
              )}

              </DialogTitle>
              
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Employee Name
                </Label>
                {/* Replace Input with Select from react-select */}
                <Select
                  value={selectedEmployee?.fullName}
                  onValueChange={handleChange}
                >
                  <SelectTrigger className="col-span-3">
                  <SelectValue style={{ color: 'black' }}>{selectedEmployee ? selectedEmployee.fullName : 'Select employee'}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {employeeOptions.map((employee) => (
                      <SelectItem key={employee.fullName} value={employee._id}>
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
                  value={startDate? startDate : "Select date"}
                  onClick={() => handleDateClick('start')}
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
                  value={endDate? endDate : "Select date"}
                  onClick={() => handleDateClick('end')}
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
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='type' className='text-right'>
                  Type
                </Label>
                <Select
                  value={leaveType}
                  onValueChange={setLeaveType}
                >
                  <SelectTrigger className='col-span-3'>
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

        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{handleStatus=="approve"? "Approve Leave":"Reject Leave"}</DialogTitle>
              <DialogDescription>
              {
              handleStatus=="approve"? 
              "Are you sure you want to approve the leave ?":
              "Are you sure you want reject the leave ?"}
                
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            {handleStatus === "approve" ? (
            <Button onClick={handleApproval} className=' bg-success text-success-foreground hover:bg-success-hover'>
              <FiCheck className="mr-2"/>
              Approve
            </Button>
          ) : 
          <Button variant="destructive" onClick={handleRejection}>
          <FiTrash2 className="mr-2" />
          Reject
        </Button>}

          
              <Button variant="outline" onClick={handleClose}>
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

export default Leaves
