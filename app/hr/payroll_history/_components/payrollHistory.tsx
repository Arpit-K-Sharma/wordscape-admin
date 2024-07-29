"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  User,
} from "lucide-react";
import { staffService, Staff } from "@/app/services/hrServices/staffService";
import {
  LeaveManagement,
  LeaveManagementService,
} from "@/app/services/hrServices/leaveManagementService";
import {
  Payroll,
  PayrollService,
} from "@/app/services/hrServices/payrollService";

interface StaffPayrollCardProps {
  staffId: string;
}

const PayrollHistory: React.FC<StaffPayrollCardProps> = ({ staffId }) => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [payroll, setPayroll] = useState<Payroll[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [staffId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [staffData, LeaveData] = await Promise.all([
        staffService.getStaffById(staffId),
        PayrollService.getPayrollForStaff(staffId),
      ]);

      setStaff(staffData);
      console.log("setting data");
      setPayroll(LeaveData);
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || ""
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {staff ? (
        <div className="flex font-archivo">
          <HRSidebar />
          <div className="h-screen w-screen py-6 font-archivo ml-[20px]">
            <div className="bg-[#ffffff] rounded-lg p-8 w-full h-[95vh] mx-auto">
              <div className="flex flex-col items-center mb-6 mr-[120px] justify-center ">
                <Avatar className="w-[7rem] h-[7rem] mb-4 text-[30px]">
                  <AvatarFallback>{getInitials(staff.fullName)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold text-center">
                  {staff.fullName}
                </h2>
                <p className="text-gray-500 text-center">{staff.position}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="grid gap-[20px] ml-[40%]">
                  <p className="">
                    <Mail className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" />{" "}
                    <strong>Email:</strong> {staff.email}
                  </p>
                  <p>
                    <Phone className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" />{" "}
                    <strong>Phone:</strong> {staff.phoneNumber}
                  </p>
                  <p>
                    <Calendar className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" />{" "}
                    <strong>Date Joined:</strong> {staff.created_at}
                  </p>
                </div>
                <div className="grid gap-[20px]">
                  <p>
                    <DollarSign className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" />{" "}
                    <strong>Daily Wage:</strong> NRP {staff.dailyWage}
                  </p>
                  <p>
                    <Briefcase className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" />{" "}
                    <strong>Department :</strong>{" "}
                    {staff.departmentNames?.join(", ") || "N/A"}
                  </p>{" "}
                  <p>
                    <User className="inline-block mr-2 text-[#5e5e5e] w-[22px] h-[22px]" />{" "}
                    <strong>Staff ID:</strong> {staff.id}
                  </p>
                </div>
              </div>

              <Table className="min-w-full bg-white">
                <TableHeader>
                  <TableRow className="border-t border-gray-200">
                    <TableHead className="py-2 px-4 text-center">
                      Year
                    </TableHead>
                    <TableHead className="py-2 px-4 text-center">
                      Month
                    </TableHead>
                    <TableHead className="py-2 px-4 text-center">
                      Working Days
                    </TableHead>
                    <TableHead className="py-2 px-4 text-center">
                      Paid Leaves
                    </TableHead>
                    <TableHead className="py-2 px-4 text-center">
                      Sub Total
                    </TableHead>
                    <TableHead className="py-2 px-4 text-center">Tax</TableHead>
                    <TableHead className="py-2 px-4 text-center">
                      Net Salary
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payroll.length > 0 ? (
                    payroll.map((entry, index) => (
                      <TableRow
                        key={entry.id}
                        className={
                          index % 2 === 0 ? "border-t border-gray-200" : ""
                        }
                      >
                        <TableCell className="py-2 px-4 text-center">
                          {entry.year}
                        </TableCell>
                        <TableCell className="py-2 px-4 text-center">
                          {entry.month}
                        </TableCell>
                        <TableCell className="py-2 px-4 text-center">
                          {entry.working_days}
                        </TableCell>
                        <TableCell className="py-2 px-4 text-center">
                          {entry.paid_leaves}
                        </TableCell>
                        <TableCell className="py-2 px-4 text-center">
                          Rs.{entry.sub_total?.toFixed(2) || "N/A"}
                        </TableCell>
                        <TableCell className="py-2 px-4 text-center">
                          Rs.{entry.tax?.toFixed(2) || "N/A"}
                        </TableCell>
                        <TableCell className="py-2 px-4 text-center">
                          Rs.{entry.net_salary?.toFixed(2) || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="py-2 px-4 text-center">
                        No payroll data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PayrollHistory;
