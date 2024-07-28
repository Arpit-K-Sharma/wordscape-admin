import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Printer,
  ScrollText,
  ArchiveRestore,
  ArchiveX,
  ListRestart,
  Warehouse,
  UserRound,
  ChevronDown,
  ChevronRight,
  Package,
  ShoppingCart,
  PackagePlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoOnly from "../../../public/images/LogoOnly.png";

const InventorySidebar: React.FC = () => {
  const router = useRouter();
  const [stockLevelOpen, setStockLevelOpen] = useState(false);
  const [purchaseOrderOpen, setPurchaseOrderOpen] = useState(false);

  return (
    <aside className="w-56 bg-white font-archivo">
      <div className="p-3 flex flex-col mt-2">
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
            onClick={() => router.push("/inventory")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-start mb-2 text-sm"
              onClick={() => setStockLevelOpen(!stockLevelOpen)}
            >
              <Warehouse className="mr-2 h-4 w-4" />
              Stock Level
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
                  onClick={() => router.push("/inventory/stocks")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Stock
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/inventory/leftover")}
                >
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Leftovers
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory/vendors")}
          >
            <Printer className="mr-2 h-4 w-4" />
            Vendors
          </Button>

          <div>
            <Button
              variant="ghost"
              className="w-full justify-start mb-2 text-sm"
              onClick={() => setPurchaseOrderOpen(!purchaseOrderOpen)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Purchase Order
              {purchaseOrderOpen ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
            {purchaseOrderOpen && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/inventory/no-entries")}
                >
                  <ArchiveX className="mr-2 h-4 w-4" />
                  Pending Entries
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm pl-8 "
                  onClick={() => router.push("/inventory/entries")}
                >
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Completed Entries
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory/reorder")}
          >
            <ListRestart className="mr-2 h-4 w-4" />
            Reorders
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/hr")}
          >
            <UserRound className="mr-2 h-4 w-4" />
            Human Resources
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/")}
          >
            <UserRound className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </nav>
      </div>
    </aside>
  );
};

export default InventorySidebar;
