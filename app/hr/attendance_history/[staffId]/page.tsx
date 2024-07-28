import React from "react";

import AttendanceHistory from "@/app/hr/attendance_history/_components/attendanceHistory";

interface PageProps {
  params: { staffId: string };
}

const AttendancePage = ({ params }: PageProps) => {
  return <AttendanceHistory staffId={params.staffId} />;
};

export default AttendancePage;
