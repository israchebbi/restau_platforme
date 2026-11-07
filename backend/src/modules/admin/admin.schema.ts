import { z } from "zod";

export const blockSchema = z.object({
  blocked: z.boolean(),
});

export const ordersQuerySchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "ACCEPTED",
      "PICKED_UP",
      "DELIVERING",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
  restaurantId: z.coerce.number().int().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});