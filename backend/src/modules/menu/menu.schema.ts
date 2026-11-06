import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2),
});

export const dishSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.string().url().optional(),
  available: z.boolean().optional(),
  categoryId: z.number().int(),
});

export const dishUpdateSchema = dishSchema.partial();