"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Calendar, GraduationCap } from "lucide-react";
import HRSidebar from "../HRSidebar/hrsidebar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Static data for HR overview
const hrOverviewData = {
  pendingLeaveRequests: 8,
  urgentApprovals: 2,
};

const HROverview: React.FC = () => {
  const [staffData, setStaffData] = useState([]);
  const [holidaysData, setHolidaysData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffResponse, holidaysResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/staff"),
          axios.get("http://127.0.0.1:8000/holidays"),
        ]);

        setStaffData(staffResponse.data.data || []);
        setHolidaysData(holidaysResponse.data.data || []);
      } catch (err) {
        setError("An error occurred while fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;

  const currentYear = new Date().getFullYear();
  const currentYearHolidays =
    holidaysData.find((data) => data.year === currentYear)?.holidays || [];

  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
      <HRSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Human Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Employees
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{staffData.length}</div>
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
            </div>

            {/* Recent Employees */}
            <Card className="h-[calc(100%-130px)]">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Recent Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100%-64px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Join Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffData.slice(0, 5).map((employee) => (
                        <TableRow key={employee._id}>
                          <TableCell>{employee.fullName}</TableCell>
                          <TableCell>
                            {employee.departmentNames.join(", ")}
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>
                            {new Date(employee.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/hr/employees")}
                  className="mt-3 bg-slate-600 text-white hover:bg-slate-800"
                >
                  View All Employees
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="h-[calc(132%-130px)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">
                Upcoming Holidays
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {currentYearHolidays.slice(0, 5).map((holiday) => (
                <p key={holiday.holiday_id} className="mt-3 mb-">
                  <b>{holiday.name}:</b>{" "}
                  {new Date(holiday.date).toLocaleDateString()}
                </p>
              ))}
              <Button
                className="mt-4 bg-slate-600 text-white hover:bg-slate-800"
                onClick={() => router.push("/hr/holidays")}
              >
                View All Holidays
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HROverview;
