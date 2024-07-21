// src/pages/HolidaysPage.tsx

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
import { FiTrash2, FiX, FiEdit } from "react-icons/fi";
import {
  holidayService,
  Holiday,
  HolidayData,
} from "@/app/services/hrServices/holidayServices";

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [holidayToUpdate, setHolidayToUpdate] = useState<Holiday | null>(null);

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from(
    { length: 6 },
    (_, i) => currentYear - 5 + i
  ).filter((year) => year <= currentYear);

  useEffect(() => {
    fetchHolidayData();
  }, []);

  const fetchHolidayData = async () => {
    try {
      const data = await holidayService.getHolidays();
      setHolidayData(data);
      setDisplayedHolidays(
        data.find((d) => d.year === currentYear)?.holidays || []
      );
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  };

  const addHoliday = async () => {
    if (newHolidayName && newHolidayDate && newHolidayDescription) {
      const newHoliday = {
        name: newHolidayName,
        date: new Date(newHolidayDate.getTime() + 86400000)
          .toISOString()
          .split("T")[0],
        description: newHolidayDescription,
      };

      try {
        await holidayService.addHoliday(newHoliday);
        await fetchHolidayData();
        setNewHolidayName("");
        setNewHolidayDate(undefined);
        setNewHolidayDescription("");
        setIsAddDialogOpen(false);
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
        await holidayService.deleteHoliday(holidayToDelete.holiday_id);
        await fetchHolidayData();
        closeDeleteDialog();
      } catch (error) {
        console.error("Error deleting holiday:", error);
      }
    }
  };

  const openUpdateDialog = (holiday: Holiday) => {
    setHolidayToUpdate(holiday);
    setNewHolidayName(holiday.name);
    setNewHolidayDate(new Date(holiday.date));
    setNewHolidayDescription(holiday.description);
    setIsUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setHolidayToUpdate(null);
    setNewHolidayName("");
    setNewHolidayDate(undefined);
    setNewHolidayDescription("");
  };

  const formatDateForBackend = (date: Date) => {
    // Create a new Date object to avoid modifying the original
    const adjustedDate = new Date(date);
    // Add one day
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    // Format to YYYY-MM-DD
    return adjustedDate.toISOString().split("T")[0];
  };

  const handleUpdateHoliday = async () => {
    if (
      holidayToUpdate &&
      newHolidayName &&
      newHolidayDate &&
      newHolidayDescription
    ) {
      // Format the date as "DD-MM-YYYY"
      const formattedDate = formatDateForBackend(newHolidayDate);

      const updatedHoliday = {
        name: newHolidayName,
        date: formattedDate,
        description: newHolidayDescription,
      };

      try {
        await holidayService.updateHoliday(
          holidayToUpdate.holiday_id,
          updatedHoliday
        );
        await fetchHolidayData();
        console.log("Holiday Data: ", updatedHoliday);
        closeUpdateDialog();
      } catch (error) {
        console.error("Error updating holiday:", error);
      }
    }
  };

  return (
    <div className="flex">
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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>
              Add Holiday
            </Button>
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
                      variant="outline"
                      onClick={() => openUpdateDialog(holiday)}
                      className="mr-2"
                    >
                      <FiEdit className="mr-2" />
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => openDeleteDialog(holiday)}
                    >
                      <FiTrash2 className="mr-2" />
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

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Holiday</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="update-name"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-date" className="text-right">
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
                <Label htmlFor="update-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="update-description"
                  value={newHolidayDescription}
                  onChange={(e) => setNewHolidayDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateHoliday}>Update Holiday</Button>
              <Button variant="secondary" onClick={closeUpdateDialog}>
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
