// AttendanceForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { format, parse, isToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HRSidebar from "@/app/components/HRSidebar/hrsidebar";
import { attendanceService } from "@/app/services/hrServices/attendanceService";

export interface Staff {
  _id?: string;
  id?: string;
  fullName: string;
}

export interface AttendanceStaff {
  staff_id: string;
  staff_name: string;
  check_in: string;
  check_out: string;
  status: "Present" | "Absent" | "Paid" | "Unpaid";
  remarks: string;
}

export interface AttendanceData {
  date: string;
  staffs: AttendanceStaff[];
}

export interface AttendanceSubmission {
  date: string;
  staffs: AttendanceStaff[];
}

const AttendanceForm: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );

  const fetchAttendanceData = async (selectedDate: Date) => {
    try {
      const formattedDate = format(selectedDate, "dd-MM-yyyy");
      const existingAttendance = await attendanceService.getAttendanceByDate(
        formattedDate
      );

      if (existingAttendance && existingAttendance.staffs.length > 0) {
        setAttendanceData(existingAttendance);
      } else {
        setAttendanceData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAttendanceData(null);
    }
  };

  useEffect(() => {
    fetchAttendanceData(date);
  }, [date]);

  const handleChange = (
    index: number,
    name: keyof AttendanceStaff,
    value: string
  ) => {
    if (attendanceData && isToday(date)) {
      const newStaffs = attendanceData.staffs.map((staff, i) => {
        if (i === index) {
          return { ...staff, [name]: value };
        }
        return staff;
      });
      setAttendanceData({ ...attendanceData, staffs: newStaffs });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceData || !isToday(date)) return;

    try {
      const dataToSend: AttendanceSubmission = {
        date: format(
          parse(attendanceData.date, "dd-MM-yyyy", new Date()),
          "yyyy-MM-dd"
        ),
        staffs: attendanceData.staffs,
      };
      console.log(dataToSend);
      const response = await attendanceService.submitAttendance(dataToSend);
      console.log(response);
      alert("Attendance submitted successfully");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Error submitting attendance. Please try again.");
    }
  };

  const isEditable = isToday(date);

  return (
    <div className="flex font-archivo h-screen">
      <HRSidebar />
      <div className="flex-1 min-h-screen mt-[-80px] flex items-center justify-center">
        <div className="w-full max-w-[100%] bg-white px-8">
          <h2 className="text-[25px] font-bold mb-6 mt-[-3rem]">
            Attendance Form for {format(date, "PPP")}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-start items-center mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      if (newDate) {
                        setDate(newDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {attendanceData && attendanceData.staffs.length > 0 ? (
              <Table className="w-full bg-white border  rounded-lg shadow-sm">
                <TableHeader>
                  <TableRow className="bg-gray-800">
                    <TableHead className="w-[200px] text-center py-2 px-4  text-white">
                      Staff Name
                    </TableHead>
                    <TableHead className="text-center py-2 px-4  text-white">
                      Check-in
                    </TableHead>
                    <TableHead className="text-center py-2 px-4 text-white">
                      Check-out
                    </TableHead>
                    <TableHead className="text-center py-2 px-4  text-white">
                      Status
                    </TableHead>
                    <TableHead className="w-[300px] text-center py-2 px-4 text-white">
                      Remarks
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.staffs.map((staff, index) => (
                    <TableRow
                      key={staff.staff_id}
                      className="border-t border-grey-900"
                    >
                      <TableCell className="flex justify-center mt-1 ">
                        {staff.staff_name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="time"
                          value={staff.check_in}
                          onChange={(e) =>
                            handleChange(index, "check_in", e.target.value)
                          }
                          className="flex item-center justify-center  border border-grey-900"
                          disabled={!isEditable}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="time"
                          value={staff.check_out}
                          onChange={(e) =>
                            handleChange(index, "check_out", e.target.value)
                          }
                          className="flex item-center justify-center border border-grey-900 "
                          disabled={!isEditable}
                        />
                      </TableCell>
                      <TableCell className="text-center py-2 px-4">
                        <Select
                          value={staff.status}
                          onValueChange={(value) =>
                            handleChange(
                              index,
                              "status",
                              value as "Present" | "Absent"
                            )
                          }
                          disabled={!isEditable}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={staff.remarks}
                          onChange={(e) =>
                            handleChange(index, "remarks", e.target.value)
                          }
                          className="w-full  border border-grey-900"
                          placeholder="Reason for leave, if any"
                          disabled={!isEditable}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                No attendance available for this date.
              </div>
            )}
            {attendanceData && attendanceData.staffs.length > 0 && (
              <div className="flex">
                <Button type="submit" disabled={!isEditable}>
                  Submit Attendance
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
