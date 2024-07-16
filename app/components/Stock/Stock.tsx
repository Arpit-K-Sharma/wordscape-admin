import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventorySidebar from "../Sidebar/InventorySidebar";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { GrAddCircle } from "react-icons/gr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import StockForm from "./StockForm";
import UpdateItemForm from "./UpdateItemForm";
import AddTypeForm from "./AddTypeForm";
import toast, { Toaster } from "react-hot-toast";
import { stockService } from "@/app/services/stockService";

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

const StocksPage: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formType, setFormType] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const [selectedType, setSelectedType] = useState<InventoryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchInventory = async () => {
    try {
      const response = await stockService.fetchInventory()
      setInventoryData(response.data)
      console.log(response.data)
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch inventory data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenForm = (type: 'add' | 'update' | 'addType', inventoryId: string) => {
    setFormType(type);
    setOpenDialogId(inventoryId);
  };

  const onSubmit = async (data: { type: string; itemName: string; availability: string }) => {
    try {
      setIsSubmitting(true);
      const newItem = await stockService.createInventoryItem(data);
      console.log("Inventory item created", newItem);
      setInventoryData([...inventoryData, newItem]);
      await fetchInventory();
      toast.success("Item added to inventory successfully!");
      closeDialog();
    } catch (error) {
      console.error("Error occurred while creating a vendor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (type: InventoryItem) => {
    setSelectedType(type);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedType(null);
  };

  const openDeleteItemDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  

  const handleTypeDelete = async () => {
    if (!selectedType) return;
    try {
      const url = `http://127.0.0.1:8000/inventory/${selectedType._id}`;
      const response = await axios.delete<{ status: string }>(url);
      if (response.data.status === "success") {
        console.log("Item Type deleted", response.data);
        setInventoryData(inventoryData.filter((v) => v._id !== selectedType._id));
        closeDeleteDialog();
        fetchInventory();
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error occurred while deleting the item Type:", error);
    }
  };

  const handleItemDelete = async () => {
    if (!selectedItem) return;
    try {
      const url = `http://127.0.0.1:8000/inventory/${selectedItem._id}/${selectedItem._id}`;
      const response = await axios.delete<{ status: string }>(url);
      if (response.data.status === "success") {
        console.log("Item Type deleted", response.data);
        setInventoryData(inventoryData.filter((v) => v._id !== selectedItem._id));
        closeDeleteDialog();
        fetchInventory();
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error occurred while deleting the item Type:", error);
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
                  <Button
                    onClick={() => handleOpenForm('addType', "668ea0962e6418b0d15b393c")}
                    disabled={isSubmitting}
                    className="font-semibold text-[15px]"
                  >
                    Add Type
                  </Button>
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
              <div className="space-y-8">
                <div className="">
                  {inventoryData.map((inventoryType) => (
                    <div key={inventoryType._id}>
                      <div className="flex flex-row justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-4 text-black">
                            {inventoryType.type}
                          </h2>
                        </div>
                        <div>
                          <Button
                            className="bg-transparent hover:bg-transparent transition-colors shadow-none"
                            onClick={() => openDeleteDialog(inventoryType)}
                          >
                            <FiTrash2 className="mr-1 text-gray-600 text-[20px] hover:text-red-600" />
                          </Button>
                          <Button
                            onClick={() => handleOpenForm('add', inventoryType._id)}
                            disabled={isSubmitting}
                            className="font-semibold text-[15px]"
                          >
                            <GrAddCircle className="font-semibold text-[15px] w-[20px] h-[20px] p-0 flex items-center justify-center" />
                          </Button>
                        </div>
                      </div>


                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-archivo">
                        {inventoryType.item.map((item) => (
                          <Card
                            key={item._id}
                            className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-row justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                                    {/* {inventoryType._id} */}
                                    {item.itemName}
                                  </h3>
                                </div>
                                <div>
                                  <Button
                                    className="bg-transparent hover:bg-transparent transition-colors shadow-none"
                                    onClick={() => openDeleteItemDialog(inventoryType)}
                                  >
                                    <FiTrash2 className="mr-1 text-gray-600 text-[20px] hover:text-red-600" />
                                  </Button>
                                  <Dialog
                                    open={isDeleteDialogOpen}
                                    onOpenChange={setIsDeleteDialogOpen}
                                  >
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Delete</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to delete this? This action
                                          cannot be undone.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button variant="destructive" onClick={handleTypeDelete}>
                                          <FiTrash2 className="mr-2" />
                                          Delete
                                        </Button>
                                        <Button variant="secondary" onClick={closeDeleteDialog}>
                                          <FiX className="mr-2" />
                                          Cancel
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Dialog open={openDialogId === inventoryType._id} onOpenChange={(open) => setOpenDialogId(open ? inventoryType._id : null)}>
                                    <DialogTrigger>
                                      {isClient ? (
                                        <Button
                                          onClick={() => handleOpenForm('update', inventoryType._id)}
                                          disabled={isSubmitting}
                                          className="font-semibold text-[15px] bg-transparent text-black hover:text-blue-600 hover:bg-transparent"
                                        >
                                          <FiEdit2 className="mr-1" /> Update
                                        </Button>
                                      ) : (
                                        <></>
                                      )}

                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Add to Inventory </DialogTitle>
                                        {formType === "add" ? (
                                          <StockForm
                                            onSubmit={onSubmit}
                                            buttonText="Add New Item"
                                            isSubmitting={isSubmitting}
                                            inventoryId={inventoryType._id}

                                            onClose={closeDialog}
                                          />
                                        ) : formType === "update" ? (
                                          <UpdateItemForm
                                            onSubmit={onSubmit}
                                            buttonText="Update Item"
                                            isSubmitting={isSubmitting}
                                            inventoryId={inventoryType.type}
                                            itemId={item._id}
                                          />
                                        ) : formType === "addType" ? (
                                          <AddTypeForm
                                            onSubmit={onSubmit}
                                            buttonText="Add New Type"
                                            isSubmitting={isSubmitting}
                                          />
                                        ) : null}

                                      </DialogHeader>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>



                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">Available</span>
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StocksPage;