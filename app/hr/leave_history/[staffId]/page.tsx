import React from 'react';
// import StaffAttendanceCard from '@/app/components/Attendance/StaffAttendanceCard';

import LeaveHistory from '@/app/hr/leave_history/_components/leaveHistory';

interface PageProps {
    params: { staffId: string }
}

const LeavePage = ({ params }: PageProps) => {
    return <LeaveHistory staffId={params.staffId} />;
};

export default LeavePage;