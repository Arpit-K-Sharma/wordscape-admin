import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Printer,
  Package,
  ClipboardList,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoOnly from "../../../public/images/LogoOnly.png";

const InventorySidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-100 font-archivo font-semibold">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 mt-10">
          <Image
            src={LogoOnly}
            alt="WordScape Logo"
            width={140}
            height={100}
            className="mx-[20%] items-center"
          />
          <div className="flex items-center mb-5">
            <h2 className="text-3xl mt-6 font-light mx-[15%]">WordScape</h2>
          </div>

          <nav className="">
            <Button
              variant="ghost"
              className="w-full justify-start mb-4 mt-5 text-lg"
              onClick={() => router.push("/inventory")}
            >
              <LayoutDashboard className="mr-2 h-6 w-6" />
              Overview
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start mb-4 text-lg"
              onClick={() => router.push("/inventory/vendors")}
            >
              <Printer className="mr-2 h-6 w-6" />
              Vendors
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start mb-4 text-lg"
              onClick={() => router.push("/inventory/entry")}
            >
              <Package className="mr-2 h-6 w-6" />
              Purchase Entry
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start mb-4 text-lg"
            >
              <ClipboardList className="mr-2 h-6 w-6" />
              Jobs
            </Button>
            <Button
              variant="ghost"
              className="w-full mb-4 justify-start text-lg"
            >
              <Settings className="mr-2 h-6 w-6" />
              Stock Level
            </Button>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default InventorySidebar;
