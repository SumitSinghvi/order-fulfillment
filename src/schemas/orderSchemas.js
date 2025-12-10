import { z } from "zod";

export const orderReceivedSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  item_name: z.string().min(1, "Item name is required"),
  sku: z.string().optional(),
  ordered_quantity: z.coerce.number().positive("Must be greater than 0"),
  unit: z.string().default("mtrs"),
  rate: z.coerce.number().positive("Must be greater than 0").optional(),
  notes: z.string().optional(),
  custom_fields: z.record(z.string()).optional(),
});

export const orderPlacedSchema = z.object({
  party_name: z.string().min(1, "Party name is required"),
  item_name: z.string().min(1, "Item name is required"),
  sku: z.string().optional(),
  ordered_quantity: z.coerce.number().positive("Must be greater than 0"),
  received_quantity: z.coerce
    .number()
    .nonnegative("Cannot be negative")
    .optional()
    .nullable(),
  unit: z.string().default("mtrs"),
  rate: z.coerce.number().positive("Must be greater than 0").optional(),
  notes: z.string().optional(),
  custom_fields: z.record(z.string()).optional(),
});

export const fulfillmentLinkSchema = z.object({
  order_received_id: z.string().uuid("Invalid order received ID"),
  order_placed_id: z.string().uuid("Invalid order placed ID"),
  quantity_fulfilled: z.coerce.number().positive("Must be greater than 0"),
});
