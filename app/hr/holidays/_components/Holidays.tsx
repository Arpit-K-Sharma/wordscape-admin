"use client";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import HRSidebar from "@/app/components/HRSidebar/hrsidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Holiday {
  holiday_id: string;
  name: string;
  date: string;
  description: string;
}

interface HolidayData {
  year: number;
  holidays: Holiday[];
}

const HolidaysPage: React.FC = () => {
  const [holidayData, setHolidayData] = useState<HolidayData[]>([]);
  const [displayedHolidays, setDisplayedHolidays] = useState<Holiday[]>([]);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState<Date | undefined>(
    undefined
  );
  const [newHolidayDescription, setNewHolidayDescription] = useState("");

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Create an array of years from (currentYear - 5) to currentYear
  const yearRange = Array.from(
    { length: 6 },
    (_, i) => currentYear - 5 + i
  ).filter((year) => year <= currentYear);

  useEffect(() => {
    // Fetch holiday data from the database
    // This is a mock function, replace with actual API call
    const fetchHolidayData = async () => {
      // Mock data
      const mockData: HolidayData[] = [
        {
          year: 2024,
          holidays: [
            {
              holiday_id: "3001",
              name: "Christmas",
              date: "2024-12-25",
              description: "Christmas Day",
            },
            {
              holiday_id: "3002",
              name: "New Year Eve",
              date: "2024-12-31",
              description: "New Years Eve",
            },
          ],
        },
      ];
      setHolidayData(mockData);
      setDisplayedHolidays(
        mockData.find((data) => data.year === currentYear)?.holidays || []
      );
    };

    fetchHolidayData();
  }, []);

  const addHoliday = () => {
    if (newHolidayName && newHolidayDate && newHolidayDescription) {
      const newHoliday: Holiday = {
        holiday_id: Math.random().toString(36).substr(2, 9),
        name: newHolidayName,
        date: newHolidayDate.toISOString().split("T")[0],
        description: newHolidayDescription,
      };

      const selectedYear = new Date(newHoliday.date).getFullYear();

      const updatedHolidayData = holidayData.map((yearData) => {
        if (yearData.year === selectedYear) {
          return {
            ...yearData,
            holidays: [...yearData.holidays, newHoliday],
          };
        }
        return yearData;
      });

      setHolidayData(updatedHolidayData);
      setDisplayedHolidays(
        updatedHolidayData.find((data) => data.year === selectedYear)
          ?.holidays || []
      );
      setNewHolidayName("");
      setNewHolidayDate(undefined);
      setNewHolidayDescription("");
    }
  };

  const deleteHoliday = (id: string) => {
    const updatedHolidayData = holidayData.map((yearData) => ({
      ...yearData,
      holidays: yearData.holidays.filter(
        (holiday) => holiday.holiday_id !== id
      ),
    }));

    setHolidayData(updatedHolidayData);
    setDisplayedHolidays(
      displayedHolidays.filter((holiday) => holiday.holiday_id !== id)
    );
  };

  return (
    <div className="flex h-screen">
      <HRSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Holidays</h1>

        <Select
          onValueChange={(value) => {
            const selectedYear = parseInt(value);
            setDisplayedHolidays(
              holidayData.find((data) => data.year === selectedYear)
                ?.holidays || []
            );
          }}
        >
          <SelectTrigger className="w-[180px] mb-4">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearRange.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-4">Add Holiday</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Holiday</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Calendar
                  mode="single"
                  selected={newHolidayDate}
                  onSelect={setNewHolidayDate}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newHolidayDescription}
                  onChange={(e) => setNewHolidayDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addHoliday}>Save Holiday</Button>
          </DialogContent>
        </Dialog>

        {displayedHolidays.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedHolidays.map((holiday) => (
                <TableRow key={holiday.holiday_id}>
                  <TableCell>{holiday.name}</TableCell>
                  <TableCell>{holiday.date}</TableCell>
                  <TableCell>{holiday.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => deleteHoliday(holiday.holiday_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No holidays found for the selected year.</p>
        )}
      </main>
    </div>
  );
};

export default HolidaysPage;
