"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventorySidebar from "../Sidebar/InventorySidebar";

interface InventoryItem {
  _id: string;
  itemName: string;
  availability: number;
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

  useEffect(() => {
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

    fetchInventory();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <InventorySidebar />
      <div className="flex-1 p-10 overflow-auto">
        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Inventory Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading inventory data...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-white">
                {inventoryData.map((item) => (
                  <Card
                    key={item._id}
                    className="bg-zinc-800 text-white shadow-sm"
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-xl text-center mb-2">
                        {item.itemName}
                      </h3>
                      <p className="text-lg text-white mb-1">
                        Availability:{" "}
                        <span className="font-medium">{item.availability}</span>
                      </p>
                      <p className="text-lg text-white">
                        Type: <span className="font-medium">{item.type}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StocksPage;
