import { z } from "zod";

export const itemSchema = z.object({
  _id: z.string(),
  itemName: z.string().min(1, "Item name is required"),
  availability: z.number().default(0),
});

export const inventoryItemSchema = z.object({
  _id: z.string(),
  type: z.string(),
  item: z.array(itemSchema),
});

export const inventoryResponseSchema = z.object({
  data: z.array(inventoryItemSchema),
});

export const itemFormSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  availability: z.string().default("0"),
});

export const typeFormSchema = z.object({
  type: z.string(),
  item: z.array(itemFormSchema),
});

export const stockFormSchema = z.object({
  items: z.array(itemFormSchema).min(1, "At least one item is required"),
});

export type Item = z.infer<typeof itemSchema>;
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
export type InventoryResponse = z.infer<typeof inventoryResponseSchema>;
export type ItemFormValues = z.infer<typeof itemFormSchema>;
export type TypeFormValues = z.infer<typeof typeFormSchema>;
export type StockFormValues = z.infer<typeof stockFormSchema>;

export interface InventoryItems {
  item: {
      itemName: string;
      availability: string;
  }[];
  type: string;
  id: string | null;
}