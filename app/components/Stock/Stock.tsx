import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventorySidebar from "../Sidebar/InventorySidebar";

interface Item {
  _id: string;
  itemName: string;
  availability: number;
}

interface InventoryItem {
  _id: string;
  type: string;
  item: Item[];
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
    <div className="flex h-screen bg-white font-archivo">
      <InventorySidebar />
      <div className="flex-1 p-10 overflow-auto">
        <Card className="w-full mb-6 bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-bold text-black">
              Inventory Stock Levels
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
              <div className="space-y-8">
                {inventoryData.map((inventoryType) => (
                  <div key={inventoryType._id}>
                    <h2 className="text-2xl font-bold mb-4 text-black">
                      {inventoryType.type}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-archivo">
                      {inventoryType.item.map((item) => (
                        <Card
                          key={item._id}
                          className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
                        >
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                              {item.itemName}
                            </h3>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-500">
                                Available
                              </span>
                              <span className="text-lg font-medium text-blue-600">
                                {item.availability}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
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
