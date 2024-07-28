"use client";

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HRSidebar from '@/app/components/HRSidebar/hrsidebar';
import { Mail, Phone, Calendar, DollarSign, Briefcase, User } from 'lucide-react';
import { staffService, Staff } from '@/app/services/hrServices/staffService';
import { attendanceService, AttendanceEntry } from '@/app/services/hrServices/attendanceService';

interface StaffAttendanceCardProps {
  staffId: string;
}



const AttendanceHistory: React.FC<StaffAttendanceCardProps> = ({ staffId }) => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');

        const [staffData, attendanceData] = await Promise.all([
          staffService.getStaffById(staffId),
          attendanceService.getAttendanceByMonth(staffId, year, month)
        ]);
        setStaff(staffData);
        setAttendance(attendanceData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [staffId]);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('') || '';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!staff) {
    return <div>Error loading staff data</div>;
  }

  return (
    <div className='flex font-archivo'>
      <HRSidebar/>
      <div className='h-screen w-screen py-6 font-archivo ml-[20px]'>
        <div className="bg-[#ffffff] rounded-lg p-8 w-full h-[95vh] mx-auto">
          <div className="flex flex-col items-center mb-6 mr-[120px] justify-center ">
            <Avatar className="w-[7rem] h-[7rem] mb-4 text-[30px]">
              <AvatarFallback>{getInitials(staff.fullName)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-center">{staff.fullName}</h2>
            <p className="text-gray-500 text-center">{staff.position}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className='grid gap-[20px] ml-[40%]'>
              <p className=''><Mail className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" /> <strong>Email:</strong> {staff.email}</p>
              <p><Phone className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" /> <strong>Phone:</strong> {staff.phoneNumber}</p>
              <p><Calendar className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" /> <strong>Date Joined:</strong> {staff.created_at}</p>
            </div>
            <div className='grid gap-[20px]'>
              <p><DollarSign className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" /> <strong>Daily Wage:</strong> NRP {staff.dailyWage}</p>
              <p><Briefcase className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" /> <strong>Department :</strong> {staff.departmentNames.join(', ')}</p>
              <p><User className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" /> <strong>Staff ID:</strong> {staff.id}</p>
            </div>
          </div>

          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableRow className="border-t border-gray-200">
                <TableHead className="py-2 px-4 text-left">Date</TableHead>
                <TableHead className="py-2 px-4 text-left">Check-in</TableHead>
                <TableHead className="py-2 px-4 text-left">Check-out</TableHead>
                <TableHead className="py-2 px-4 text-left">Status</TableHead>
                <TableHead className="py-2 px-4 text-left">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { attendance.length > 0 ? (attendance.map((entry, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'border-t border-gray-200' : ''}>
                  <TableCell className="py-2 px-4">{entry.date}</TableCell>
                  <TableCell className="py-2 px-4">{entry.staffs[0].check_in || 'N/A'}</TableCell>
                  <TableCell className="py-2 px-4">{entry.staffs[0].check_out || 'N/A'}</TableCell>
                  <TableCell className="py-2 px-4">{entry.staffs[0].status}</TableCell>
                  <TableCell className="py-2 px-4">{entry.staffs[0].remarks || 'N/A'}</TableCell>
                </TableRow>
              ))):
              (
                <TableRow>
                  <TableCell colSpan={5} className="py-2 px-4 text-center">No attendance data available</TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;