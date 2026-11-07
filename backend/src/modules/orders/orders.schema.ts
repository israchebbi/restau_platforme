import { z } from "zod";

export const createOrderSchema = z.object({
  restaurantId: z.number().int(),
  items: z
    .array(
      z.object({
        dishId: z.number().int(),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1),
  paymentMode: z.enum(["ONLINE", "CASH"]),
  address: z.string().min(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().min(8),
});

export const restaurantStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PREPARING", "READY", "CANCELLED"]),
});

export const deliveryStatusSchema = z.object({
  status: z.enum(["PICKED_UP", "DELIVERING", "DELIVERED"]),
});