// StocksPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventorySidebar from "../Sidebar/InventorySidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StockForm from "./StockForm";
import toast, { Toaster } from "react-hot-toast";

interface InventoryItem {
  _id: string;
  itemName: string;
  availability: string;
  type: string;
}

interface ApiResponse {
  status: string;
  status_code: number;
  data: InventoryItem[];
}

const StocksPage: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        "http://127.0.0.1:8000/inventory"
      );
      setInventoryData(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch inventory data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const onSubmit = async (data: { itemName: string; availability: string; type: string }) => {
    try {
      setIsSubmitting(true);
      const url = "http://localhost:8000/inventory";
      const response = await axios.post<InventoryItem>(url, {
        itemName: data.itemName,
        availability: data.availability,
        type: data.type,
      });
      console.log("Inventory item created", response.data);
      setInventoryData([...inventoryData, response.data]);
      await fetchInventory();
      setIsAddDialogOpen(false);
      toast.success("Item added to inventory successfully!");
    } catch (error) {
      console.error("Error occurred while creating a vendor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-archivo">
      <InventorySidebar />
      <div className="flex-1 p-10 overflow-auto">
        <Card className="w-full mb-6 bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-bold text-black">
              <div className="flex flex-row justify-between">
                <div>
                  Inventory Stock Levels
                </div>
                <div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger>
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        disabled={isSubmitting}
                        className="font-semibold text-[15px]"
                      >
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Item to Inventory</DialogTitle>
                        <StockForm
                          onSubmit={onSubmit}
                          buttonText="Add Inventory Item"
                          isSubmitting={isSubmitting}
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            {isLoading ? (
              <p className="text-center text-lg text-black">
                Loading inventory data...
              </p>
            ) : error ? (
              <p className="text-center text-lg text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-archivo">
                {inventoryData.map((item) => (
                  <Card
                    key={item._id}
                    className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="bg-gray-100 py-2 px-4 rounded-t-lg">
                        <h3 className="font-bold text-lg text-center truncate text-black">
                          {item.itemName}
                        </h3>
                      </div>
                      <div className="space-y-3 mt-4">
                        <p className="text-base flex justify-between items-center">
                          <span className="text-zinc-600">Availability:</span>
                          <span className="font-semibold text-lg text-black">
                            {item.availability}
                          </span>
                        </p>
                        <p className="text-base flex justify-between items-center">
                          <span className="text-zinc-600">Type:</span>
                          <span className="font-semibold text-black">
                            {item.type}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              disabled={isSubmitting}
            >
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item to Inventory</DialogTitle>
              <StockForm
                onSubmit={onSubmit}
                buttonText="Add Inventory Item"
                isSubmitting={isSubmitting}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog> */}
      </div>
      <Toaster />
    </div>
  );
};

export default StocksPage;