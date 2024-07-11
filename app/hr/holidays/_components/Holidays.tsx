"use client";
import React, { useState } from "react";
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

interface Holiday {
  id: number;
  name: string;
  date: Date;
}

const HolidaysPage: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState<Date | undefined>(
    undefined
  );

  const addHoliday = () => {
    if (newHolidayName && newHolidayDate) {
      const newHoliday: Holiday = {
        id: holidays.length + 1,
        name: newHolidayName,
        date: newHolidayDate,
      };
      setHolidays([...holidays, newHoliday]);
      setNewHolidayName("");
      setNewHolidayDate(undefined);
    }
  };

  const deleteHoliday = (id: number) => {
    setHolidays(holidays.filter((holiday) => holiday.id !== id));
  };

  return (
    <div className="flex h-screen">
      <HRSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Holidays</h1>

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
            </div>
            <Button onClick={addHoliday}>Save Holiday</Button>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell>{holiday.name}</TableCell>
                <TableCell>{holiday.date.toDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deleteHoliday(holiday.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
};

export default HolidaysPage;
