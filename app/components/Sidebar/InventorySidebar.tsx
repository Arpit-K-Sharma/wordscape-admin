import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Printer,
  Package,
  ClipboardList,
  Settings,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";

const InventorySidebar = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-5">WordScape</h2>
          <nav>
            <Button
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => router.push("/inventory")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => router.push("/inventory/vendors")}
            >
              <Printer className="mr-2 h-4 w-4" />
              Vendors
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <ClipboardList className="mr-2 h-4 w-4" />
              Jobs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Stock Level
            </Button>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default InventorySidebar;
