"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Calendar, GraduationCap } from "lucide-react";
import HRSidebar from "../HRSidebar/hrsidebar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Static data
const hrOverviewData = {
  totalEmployees: 157,
  newEmployeesThisMonth: 3,
  pendingLeaveRequests: 8,
  urgentApprovals: 2,
  upcomingTrainings: 3,
  daysToNextTraining: 5,
};

const recentEmployees = [
  {
    id: "EMP001",
    name: "John Doe",
    department: "Printing",
    position: "Press Operator",
    joinDate: "2024-06-15",
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    department: "Postprinting",
    position: "Graphic Designer",
    joinDate: "2024-06-10",
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    department: "Prepress",
    position: "Bindery Technician",
    joinDate: "2024-06-05",
  },
  {
    id: "EMP004",
    name: "Emily Brown",
    department: "Printing",
    position: "Account Manager",
    joinDate: "2024-06-01",
  },
  {
    id: "EMP005",
    name: "Postpress",
    department: "IT",
    position: "Systems Administrator",
    joinDate: "2024-05-28",
  },
];

const HROverview: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
      <HRSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">HR Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hrOverviewData.totalEmployees}
              </div>
              <p className="text-xs text-muted-foreground">
                +{hrOverviewData.newEmployeesThisMonth} new this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Leave Requests
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hrOverviewData.pendingLeaveRequests}
              </div>
              <p className="text-xs text-muted-foreground">
                {hrOverviewData.urgentApprovals} urgent approvals needed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Holidays
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">
                {hrOverviewData.upcomingTrainings}
              </div>
              <p className="text-xs text-muted-foreground">
                Next training in {hrOverviewData.daysToNextTraining} days
              </p> */}
            </CardContent>
          </Card>
        </div>

        {/* Recent Employees */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    {/* <TableHead>Position</TableHead> */}
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      {/* <TableCell>{employee.position}</TableCell> */}
                      <TableCell>{employee.joinDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HROverview;
