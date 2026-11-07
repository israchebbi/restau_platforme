import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  vehicle: z.string().optional(),
});

export const availabilitySchema = z.object({
  available: z.boolean(),
});

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});