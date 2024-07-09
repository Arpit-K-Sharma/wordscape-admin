import React from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoOnly from "../../../public/images/LogoOnly.png";

const InventorySidebar: React.FC = () => {
  const router = useRouter();

  return (
    <aside className="w-56 bg-white shadow-md  font-archivo">
      <div className="p-3 flex flex-col mt-2">
        <div className="flex items-center mb-4">
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
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory/stocks")}
          >
            <Warehouse className="mr-2 h-4 w-4" />
            Stock Level
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory/vendors")}
          >
            <Printer className="mr-2 h-4 w-4" />
            Vendors
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory/entry")}
          >
            <ScrollText className="mr-2 h-4 w-4" />
            Entry Form
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory/entries")}
          >
            <ArchiveRestore className="mr-2 h-4 w-4" />
            PO with Entries
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory/no-entries")}
          >
            <ArchiveX className="mr-2 h-4 w-4" />
            PO w/o Entries
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2 text-sm"
            onClick={() => router.push("/inventory/reorder")}
          >
            <ListRestart className="mr-2 h-4 w-4" />
            Reorders
          </Button>
        </nav>
      </div>
    </aside>
  );
};

export default InventorySidebar;