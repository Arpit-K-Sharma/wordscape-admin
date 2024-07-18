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

interface InventoryResponse {
  data: InventoryItem[];
}

const StocksPage: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialogId, setOpenDialogId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formType, setFormType] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<InventoryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isItemDeleteDialogOpen, setIsItemDeleteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchInventory = async () => {
    try {
      const response = await stockService.fetchInventory();
      const data: InventoryItem[] = (response as InventoryResponse).data;

      if (Array.isArray(data)) {
        setInventoryData(data);
      } else {
        throw new Error("Data is not an array");
      }

      console.log(data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch inventory data");
      console.error(err);
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
    console.log(`Handling form for type: ${type}, inventoryId: ${inventoryId}`);
    setFormType(type);
    setOpenDialogId(inventoryId);
    // openDialog();
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
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
    setIsItemDeleteDialogOpen(true);
  };

  const closeDeleteItemDialog = () => {
    setIsItemDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleTypeDelete = async () => {
    if (!selectedType) return;
    try {
      const response = await stockService.deleteType(selectedType._id);
      if (response.status === 'success') {
        console.log('Item Type deleted', response);
        setInventoryData(inventoryData.filter((v) => v._id !== selectedType._id));
        toast.success("Category deleted successfully!");
        closeDeleteDialog();
        fetchInventory();
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error occurred while deleting the item Type:', error);
    }
  };

  const handleItemDelete = async (itemId: string) => {
    if (!selectedItem) return;
    console.error('No selected item to delete');
    try {
      const url = `http://127.0.0.1:8000/inventory/${selectedItem._id}/${itemId}`;
      const response = await axios.delete<{ status: string }>(url);
      if (response.data.status === "success") {
        console.log("Item Type deleted", selectedItem._id, response.data);
        setInventoryData(inventoryData.filter((item) => item._id !== itemId));
        closeDeleteItemDialog();
        await fetchInventory();
        fetchInventory();
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error occurred while deleting the item Type:", error);
    }
  };



  return (
    <div className="flex h-screen bg-gray-100 font-archivo">
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
                    onClick={() => handleOpenForm('addType', '6697898fae9ff72cee6b1ee7')}
                    disabled={isSubmitting}
                    className="font-semibold text-[15px]"
                  >
                    Add Type
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-8 h-[calc(100vh-200px)]">
            {isLoading ? (
              <p className="text-center text-lg text-black">
                Loading inventory data...
              </p>
            ) : error ? (
              <p className="text-center text-lg text-red-500">{error}</p>
            ) : (
              <div className="space-y-8 overflow-y-auto h-full custom-scrollbar">
                <div className="">
                  {inventoryData && inventoryData.map((inventoryType) => (
                    <div key={inventoryType._id} className="shadow-sm rounded-md p-[20px]">
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
                        {inventoryType && inventoryType.item.map((item) => (
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
                                    key={item._id}
                                    className="bg-transparent hover:bg-transparent transition-colors shadow-none"
                                    onClick={() => {
                                      console.log('item._id:', item._id);
                                      openDeleteItemDialog(inventoryType)
                                    }}
                                  >
                                    <FiTrash2 className="mr-1 text-gray-600 text-[20px] hover:text-red-600" />
                                  </Button>
                                  <Dialog
                                    open={isDeleteDialogOpen}
                                    onOpenChange={(open) => open ? setIsDeleteDialogOpen(true) : closeDeleteDialog()}
                                  >
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Delete Category Form Inventory</DialogTitle>
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
                                  <Dialog
                                    open={isItemDeleteDialogOpen}
                                    onOpenChange={setIsItemDeleteDialogOpen}
                                  >
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Delete Item From Category</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to delete this? This action
                                          cannot be undone.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button variant="destructive" onClick={() => handleItemDelete(item._id)}>
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
                                  <Dialog open={openDialogId === inventoryType._id} onOpenChange={(open) => setOpenDialogId(inventoryType._id)}>
                                    <DialogTrigger>

                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Add to Inventory</DialogTitle>
                                      </DialogHeader>
                                      {formType === "add" ? (
                                        <StockForm
                                          onSubmit={onSubmit}
                                          buttonText="Add New Item"
                                          isSubmitting={isSubmitting}
                                          inventoryId={inventoryType._id}
                                          onOpenChange={(open) => open ? setIsDialogOpen(true) : closeDialog()}
                                        />
                                      ) : formType === "update" ? (
                                        <UpdateItemForm
                                          onSubmit={onSubmit}
                                          buttonText="Update Item"
                                          isSubmitting={isSubmitting}
                                          inventoryId={inventoryType._id}
                                          itemId={item._id}
                                          onClose={() => setIsUpdateFormOpen(false)}
                                        />
                                      ) : formType === "addType" ? (
                                        <AddTypeForm
                                          onSubmit={onSubmit}
                                          buttonText="Add New Type"
                                          isSubmitting={isSubmitting}
                                        />
                                      ) : null}
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
    </div >
  );
};

export default StocksPage;