import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ScrollText,
  ArchiveRestore,
  ArchiveX,
  ListRestart,
  Warehouse,
  UserRound,
  ChevronDown,
  LogOut,
  ChevronRight,
  Package,
  PackagePlus,
  Paperclip,
  BookOpen,
  Ruler,
  Layers,
  FileText,
  ExternalLink,
  Edit,
  ShieldCheck,
  CheckSquare,
  Calculator,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoOnly from "../../../public/images/LogoOnly.png";
import { Clipboard } from "lucide-react";
import Cookies from "js-cookie";

const ErpSidebar: React.FC = () => {
  const router = useRouter();
  const [stockLevelOpen, setStockLevelOpen] = useState(false);
  const [paperCategoryOpen, setPaperCategoryOpen] = useState(false);
  const [outerCategoryOpen, setOuterCategoryOpen] = useState(false);
  const [tasksCategoryOpen, setTasksCategoryOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    router.push("/");
  };

  return (
    <aside className="w-56 bg-white font-archivo h-screen">
      <div className="p-3 flex flex-col">
        <div className="flex items-center mb-4 max-sm:ml-[50px]">
          <Image
            src={LogoOnly}
            alt="WordScape Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <h2 className="text-xl font-light">WordScape</h2>
        </div>

        <nav className="flex-grow overflow-y-auto">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/erp")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Button>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-start mb-2 text-sm"
              onClick={() => setStockLevelOpen(!stockLevelOpen)}
            >
              <UserRound className="mr-2 h-4 w-4" />
              Users
              {stockLevelOpen ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
            {stockLevelOpen && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/user")}
                >
                  <UserRound className="mr-2 h-4 w-4" />
                  Staffs
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/customer")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </Button>
              </>
            )}
          </div>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-start mb-2 text-sm"
              onClick={() => setPaperCategoryOpen(!paperCategoryOpen)}
            >
              <Paperclip className="mr-2 h-4 w-4" />
              Paper Feature
              {paperCategoryOpen ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
            {paperCategoryOpen && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/paper/paperType")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Paper Types
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/paper/paperSize")}
                >
                  <Ruler className="mr-2 h-4 w-4" />
                  Paper Sizes
                </Button>
                {/* <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/paper/paperThickness")}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Paper Thickness
                </Button> */}
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/paper/sheets")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Sheets
                </Button>
              </>
            )}
          </div>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-start mb-2 text-sm"
              onClick={() => setOuterCategoryOpen(!outerCategoryOpen)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Outer Feature
              {outerCategoryOpen ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
            {outerCategoryOpen && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/outer/binding")}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Binding
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/outer/plates")}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Plates
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/erp/outer/lamination")}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Lamination
                </Button>
              </>
            )}
          </div>

          {/* New Inventory Button */}

          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/erp/costCalculation")}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Cost Calculation
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm "
            onClick={() => router.push("/erp/order")}
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Orders
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory")}
          >
            <Warehouse className="mr-2 h-4 w-4" />
            Inventory
          </Button>

          {/* New Human Resources Button */}
          <Button
            variant="ghost"
            className="w-full justify-start mb-5 text-sm "
            onClick={() => router.push("/hr")}
          >
            <Users className="mr-2 h-4 w-4" />
            Human Resources
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

export default ErpSidebar;
