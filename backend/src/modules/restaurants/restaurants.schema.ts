import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(3),
  latitude: z.number(),
  longitude: z.number(),
  cuisine: z.string().min(2),
  logo: z.string().url().optional(),
  openingHours: z.string().optional(),
  commissionRate: z.number().min(0).max(1).optional(),
  manager: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    password: z.string().min(6),
  }),
});

export const updateRestaurantSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(3).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  cuisine: z.string().min(2).optional(),
  logo: z.string().url().optional(),
  openingHours: z.string().optional(),
});

export const statusSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED"]),
});