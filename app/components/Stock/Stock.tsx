import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import StockForm from "./StockForm";
import UpdateItemForm from "./UpdateItemForm";
import AddTypeForm from "./AddTypeForm";
import toast, { Toaster } from "react-hot-toast";
import { stockService } from "@/app/services/stockService";
import { Input } from "@/components/ui/input";
import { Plus, ChevronUp, ChevronDown, Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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

const itemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  availability: z.string().default("0"),
});

const typeSchema = z.object({
  type: z.string(),
  item: z.array(itemSchema),
});

const stockSchema = z.object({
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

type TypeFormValues = z.infer<typeof typeSchema>;
type AddItemValues = z.infer<typeof stockSchema>;

interface ItemType {
  itemName: string;
  availability: string;
}

interface TypeFormProps {
  defaultValues?: Partial<TypeFormValues>;
  buttonText: string;
  isSubmitting: boolean;
  onSubmit: (data: {
    type: string;
    itemName: string;
    availability: string;
  }) => Promise<void>;
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
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const currentItemRef = useRef(null);

  const router = useRouter();

  const form = useForm<TypeFormValues>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      type: "",
      item: [{ itemName: "", availability: "" || "0" }],
    }
  });
  const { control: typeControl, handleSubmit: handleSubmit } = form;
  const { fields: typeFields, append: appendType, remove: removeType } = useFieldArray({
    control: typeControl,
    name: "item",
  });

  const [item, setItem] = useState<TypeFormProps[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const onSubmit = async (data: TypeFormValues) => {
    try {
      const url = "http://localhost:8000/inventory";
      await toast.promise(
        axios.post<TypeFormProps>(url, data),
        {
          loading: 'Creating item...',
          success: (response) => {
            console.log("Item created", response.data);
            setItem([...item, response.data]);
            fetchInventory();
            return "Item created successfully";
          },
          error: (error) => {
            console.error("Error occurred while creating a new item:", error);
            return "Error creating item";
          },
        },
        {
          duration: 3000,
        }
      );
    } catch (error) {
      console.error("Error occurred while creating a new item:", error);
    }
    setIsAddDialogOpen(false);
  };

  const onSubmitAdd = async (data: AddItemValues, itemId: string) => {
    try {
      const url = `http://localhost:8000/add-item/${itemId}`;
      await toast.promise(
        axios.post(url, data.items),
        {
          loading: 'Creating item...',
          success: (response) => {
            console.log("Item created", response.data);
            setItem([...item, response.data]);
            fetchInventory();
            return "Item created successfully";
          },
          error: (error) => {
            console.error("Error occurred while creating a new item:", error);
            return "Error creating item";
          },
        },
        {
          duration: 3000,
        }
      );
    } catch (error) {
      console.error("Error occurred while creating a new item:", error);
    }
  };

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

  const handleOpenForm = (type: 'add' | 'update', inventoryId: string) => {
    console.log(`Handling form for type: ${type}, inventoryId: ${inventoryId}`);
    setFormType(type);
    setOpenDialogId(inventoryId);
  };

  const openItemDialog = () => {
    setIsItemDialogOpen(true);
  };

  const closeItemDialog = () => {
    setIsItemDialogOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
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
        fetchInventory();
        closeDeleteDialog();
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

  const itemform = useForm<AddItemValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      items: [
        { itemName: "", availability: "" || "0" },
      ],
    },
  });

  const { control: itemControl, handleSubmit: handleItemSubmit } = itemform;
  const { fields: itemFields, append: appendItem, remove: removeItems } = useFieldArray({
    control: itemControl,
    name: "items",
  });

  const addItem = () => {
    itemform.setValue(`items`, [
      ...itemform.getValues("items"),
      { itemName: "", availability: "" || "0" },
    ]);
  };

  const removeItem = (index: number) => {
    if (itemFields.length > 1) {
      removeItems(index);
    }
  };

  const scrollUp = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  const scrollDown = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex < inventoryData.length - 1 ? prevIndex + 1 : prevIndex;
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const containerHeight = scrollContainerRef.current.clientHeight;
      const scrollTo = index * 270;
      scrollContainerRef.current.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-archivo">
      <InventorySidebar />
      <div className="flex-1 p-10">
        <Card className="w-full mb-6 h-full bg-white shadow-md rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black">
              <div className="flex flex-row justify-between">
                <div className="flex ">
                <div className=" text-3xl  mt-[20px] ">
                  Inventory Stock Levels
                </div>
                <div className="mt-[-5px] ml-[10px]">
                  <span className="text-2xl font-normal text-gray-600 ml-2">
                    <HoverCard>
                      <HoverCardTrigger><Info className="hover:cursor-pointer hover:text-blue-900" /></HoverCardTrigger>
                      <HoverCardContent className="w-[300px] rounded-[20px]">
                        <div className="p-[10px] items-center justify-center font-archivo">
                          <h1 className="ml-[20px] font-semibold mb-[10px] text-[15px] text-gray-700">
                            Information
                          </h1>
                          <p className=" ml-[20px] text-left text-gray-600 text-[15px]">
                          This page provides a comprehensive overview of your inventory, enabling you to efficiently manage and monitor your stock levels. 
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </span>
                </div>
                </div>
                <div className="mr-[15px]">
                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}>
                    <DialogTrigger>
                      <Button
                        disabled={isSubmitting}
                        className="font-semibold text-[15px] mt-[20px]"
                        onClick={openDialog}
                      >
                        Add Type
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Category to Inventory</DialogTitle>
                        <DialogDescription>
                          <Form {...form}>
                            <form onSubmit={handleSubmit(async (data) => {
                              await onSubmit(data);
                              form.reset();
                            })}
                              className="space-y-4"
                            >
                              {typeFields.map((item, index) => (
                                <div key={item.id} className="bg-white rounded-md shadow-lg p-4 space-y-4">
                                  <FormField
                                    control={typeControl}
                                    name="type"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Insert the type" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={typeControl}
                                    name={`item.${index}.itemName`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Item Name</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Insert the item name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              ))}
                              <Button type="submit" className="w-full" disabled={isSubmitting}
                                onClick={closeDialog}>
                                Add to Inventory
                              </Button>
                            </form>
                          </Form>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
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
              <div className="flex flex-col h-full">
                <div className="flex justify-between mb-4">
                  <Button
                    onClick={scrollUp}
                    disabled={currentIndex === 0}
                    className={`${currentIndex === 0 ? 'bg-gray-300 text-black' : ''}`}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={scrollDown}
                    disabled={currentIndex >= inventoryData.length - 2}
                    className={`${currentIndex >= inventoryData.length - 2 ? 'bg-gray-300 text-black' : ''}`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div
                  className="overflow-y-auto flex-grow"
                  style={{ scrollBehavior: 'smooth' }}
                  ref={scrollContainerRef}
                >
                  {inventoryData && inventoryData.length > 0 && (
                    inventoryData.map((inventoryType, index) => (
                      <div
                        key={inventoryType._id}
                        className="p-5 bg-gray-100 rounded-[10px] shadow-md w-full h-[250px] mb-4"
                        ref={index === currentIndex ? currentItemRef : null}
                      >
                        <div className="flex justify-between mb-4">
                          <h2 className="text-2xl pl-3 font-bold text-gray-900 mt-[5px]">{inventoryType.type}</h2>
                          <div className="flex space-x-2">
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                              <DialogTrigger>
                                <Button className="bg-white rounded-full hover:bg-red-700 text-black hover:text-white transition-colors shadow-none p-2" onClick={() => openDeleteDialog(inventoryType)}>
                                  <FiTrash2 className="text-xl" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Category from Inventory</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this? This action cannot be undone.
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
                            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                              <DialogTrigger>
                                <Button className="bg-white rounded-full hover:bg-green-800 hover:text-white text-black transition-colors p-2 shadow-none" onClick={openItemDialog}>
                                  <Plus className="text-xl" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Item to Inventory</DialogTitle>
                                  <DialogDescription>
                                    <Form {...itemform}>
                                      <form
                                        onSubmit={handleItemSubmit((data) => {
                                          onSubmitAdd(data, inventoryType._id);
                                          itemform.reset();
                                        })}
                                        className="space-y-4"
                                      >
                                        {itemFields.map((item, index) => (
                                          <div key={item.id} className="rounded-md shadow-md p-4 space-y-4">
                                            <FormField control={itemControl} name={`items.${index}.itemName`} render={({ field }) => (
                                              <FormItem>
                                                <FormLabel>Item Name</FormLabel>
                                                <FormLabel className="ml-[320px]">
                                                  <Button type="button" className="bg-transparent hover:bg-red-400 text-gray-400 hover:text-white transition-colors shadow-none p-2 rounded-full" onClick={() => removeItem(index)}>
                                                    <FiTrash2 className="text-xl" />
                                                  </Button>
                                                </FormLabel>
                                                <FormControl>
                                                  <Input placeholder="Insert the item name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )} />
                                          </div>
                                        ))}
                                        <Button type="button" onClick={addItem} className="text-white">
                                          Add Item
                                        </Button>
                                        <Button type="submit" className="text-white w-full" disabled={isSubmitting} onClick={closeItemDialog}>
                                          Add Item
                                        </Button>
                                      </form>
                                    </Form>
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        <div className="h-[calc(100%-60px)] pl-3 overflow-y-auto mb-[0px]">
                          <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            {inventoryType.item.map((item) => (
                              <Card key={item._id} className="bg-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 hover:bg-gray-50 max-h-[200px] rounded-[15px]">
                                <CardContent className="p-4">
                                  <div className="flex flex-row justify-between mb-2">
                                    <div className="w-[90px]">
                                      <h3 className="font-semibold pt-[5px] mb-[30px] text-lg text-[#3B3939] truncate">{item.itemName}</h3>
                                    </div>
                                    <div>
                                      <Dialog open={isItemDeleteDialogOpen} onOpenChange={setIsItemDeleteDialogOpen}>
                                        <DialogTrigger>
                                          <Button className="bg-white hover:bg-red-600 text-[#686666] hover:text-white transition-colors shadow-none p-2 rounded-full" onClick={() => { setSelectedItemId(item._id); openDeleteItemDialog(inventoryType) }}>
                                            <FiTrash2 className="text-[20px]" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Delete from Inventory</DialogTitle>
                                            <DialogDescription>
                                              Are you sure you want to delete this? This action cannot be undone.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <DialogFooter>
                                            <Button variant="destructive" onClick={() => handleItemDelete(selectedItemId)}>
                                              <FiTrash2 className="mr-2" />
                                              Delete
                                            </Button>
                                            <Button variant="secondary" onClick={closeDeleteItemDialog}>
                                              <FiX className="mr-2" />
                                              Cancel
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#7B7676] font-semibold">In Stock:</span>
                                    <span className="text-lg font-semibold text-black">{item.availability}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StocksPage;