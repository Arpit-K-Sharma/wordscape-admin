import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  GraduationCap,
  BarChart,
  Settings,
  LogOut,
  UserRound,
  Boxes,
  ArrowLeft,
  CheckCircle,
  CalendarPlus,
  DollarSign,
  ClipboardList,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoOnly from "../../../public/images/LogoOnly.png";

const HRSidebar: React.FC = () => {
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("accessToken");
    router.push("/");
  };

  return (
    <aside className="w-56 bg-white shadow-md font-archivo">
      <div className="p-3 flex flex-col">
        <div className="flex items-center mb-4">
          <Image
            src={LogoOnly}
            alt="WordScape Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <h2 className="text-xl font-light">WordScape HR</h2>
        </div>

        <nav className="flex-grow overflow-y-auto">
          <Button
            variant="ghost"
            className="w-full mt-3 justify-start mb-5 text-sm"
            onClick={() => router.push("/inventory")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Inventory
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm bg-gray-200"
            onClick={() => router.push("/erp")}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/hr")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/hr/employees")}
          >
            <Users className="mr-2 h-4 w-4" />
            Employees
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/hr/attendance")}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Attendance
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/hr/payroll")}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Payroll
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/hr/leave-management")}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Leave Management
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/hr/departments")}
          >
            <Boxes className="mr-2 h-4 w-4" />
            Departments
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/hr/holidays")}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Holidays
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </nav>
      </div>
    </aside>
  );
};

export default HRSidebar;
