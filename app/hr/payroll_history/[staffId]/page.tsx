import React from 'react';
// import StaffAttendanceCard from '@/app/components/Attendance/StaffAttendanceCard';

import PayrollHistory from '@/app/hr/payroll_history/_components/payrollHistory';

interface PageProps {
    params: { staffId: string }
}

const PayrollPage = ({ params }: PageProps) => {
    return <PayrollHistory staffId={params.staffId} />;
};

export default PayrollPage;