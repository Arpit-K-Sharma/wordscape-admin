"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
import HRSidebar from "@/app/components/HRSidebar/hrsidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiTrash2, FiX } from "react-icons/fi";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<Holiday | null>(null);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Create an array of years from (currentYear - 5) to currentYear
  const yearRange = Array.from(
    { length: 6 },
    (_, i) => currentYear - 5 + i
  ).filter((year) => year <= currentYear);

  useEffect(() => {
    fetchHolidayData();
  }, []);

  const fetchHolidayData = async () => {
    try {
      const response = await axios.get<HolidayData[]>(
        "http://127.0.0.1:8000/holidays"
      );
      setHolidayData(response.data);
      setDisplayedHolidays(
        response.data.find((data) => data.year === currentYear)?.holidays || []
      );
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  };

  const addHoliday = async () => {
    if (newHolidayName && newHolidayDate && newHolidayDescription) {
      const newHoliday = {
        name: newHolidayName,
        date: newHolidayDate.toISOString(),
        description: newHolidayDescription,
      };

      try {
        await axios.post("http://127.0.0.1:8000/holidays", newHoliday);

        // Refresh the holiday data after successful addition
        await fetchHolidayData();

        setNewHolidayName("");
        setNewHolidayDate(undefined);
        setNewHolidayDescription("");
      } catch (error) {
        console.error("Error adding holiday:", error);
      }
    }
  };

  const openDeleteDialog = (holiday: Holiday) => {
    setHolidayToDelete(holiday);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setHolidayToDelete(null);
  };

  const handleDeleteHoliday = async () => {
    if (holidayToDelete) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/holidays/${holidayToDelete.holiday_id}`
        );

        // Refresh the holiday data after successful deletion
        await fetchHolidayData();

        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting holiday:", error);
      }
    }
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
                      onClick={() => openDeleteDialog(holiday)}
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

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Holiday</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this holiday? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDeleteHoliday}>
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
};

export default HolidaysPage;
