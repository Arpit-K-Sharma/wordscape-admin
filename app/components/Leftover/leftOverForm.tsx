"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { leftoverService } from "@/app/services/inventoryServices/leftoverService";
import { PlusCircle, Send, Trash2 } from "lucide-react";
import { InventoryItem } from "../../Schema/inventorySchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { inventoryService } from "@/app/services/inventoryServices/inventoryservice";

interface LeftoverFormProps {
  orderId: string;
  onSubmit: (data: any) => void;
}

const LeftoverForm: React.FC<LeftoverFormProps> = ({ orderId, onSubmit }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      order_id: orderId,
      items: [
        { inventory_id: "", item_id: "", quantity: 0, reason: "", type: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await inventoryService.fetchInventory();
        console.log("Inventory data:", response);
        setInventory(response);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Failed to fetch inventory. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  if (isLoading) return <div>Loading inventory...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <ScrollArea className="h-[400px] rounded-md border ">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col space-y-4 p-[10px] rounded-md mb-4"
            >
              <div className="">
                <div className="flex flex-row w-[70px]">
                  <div className="ml-[390px]">
                    <Button
                      type="button"
                      className="bg-transparent hover:bg-transparent shadow-sm self-start"
                      onClick={() => remove(index)}
                    >
                      <Trash2
                        className="mr-1 text-gray-800  hover:text-red-600"
                        size={18}
                      />
                    </Button>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name={`items.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue(`items.${index}.item_id`, "");
                          form.setValue(`items.${index}.inventory_id`, "");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory.map((inv) => (
                            <SelectItem key={inv._id} value={inv._id}>
                              {inv.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.item_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const [inventoryId, itemId] = value.split("|");
                          form.setValue(
                            `items.${index}.inventory_id`,
                            inventoryId
                          );
                          field.onChange(itemId);
                        }}
                        value={
                          field.value
                            ? `${form.getValues(
                                `items.${index}.inventory_id`
                              )}|${field.value}`
                            : ""
                        }
                        disabled={!form.getValues(`items.${index}.type`)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an item" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory
                            .find(
                              (inv) =>
                                inv._id ===
                                form.getValues(`items.${index}.type`)
                            )
                            ?.item.map((item) => (
                              <SelectItem
                                key={`${form.getValues(
                                  `items.${index}.type`
                                )}|${item._id}`}
                                value={`${form.getValues(
                                  `items.${index}.type`
                                )}|${item._id}`}
                              >
                                {item.itemName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="p-[10px]">
                      <FormLabel className="font-semibold">Quantity</FormLabel>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.reason`}
                  render={({ field }) => (
                    <FormItem className="p-[10px]">
                      <FormLabel className="font-semibold">Reason</FormLabel>
                      <Input {...field} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex space-x-4">
          <div>
            <Button
              type="button"
              onClick={() =>
                append({
                  item_id: "",
                  inventory_id: "",
                  quantity: 0,
                  reason: "",
                  type: "",
                })
              }
            >
              <div className="bg-transparent shadow-sm hover:bg-transparent mr-[10px]">
                <PlusCircle size={18} />
              </div>
              <div>Add Item</div>
            </Button>
          </div>
          <Button type="submit">
            <div className="mr-[10px]">
              <Send size={15} />
            </div>
            <div>Submit</div>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeftoverForm;
