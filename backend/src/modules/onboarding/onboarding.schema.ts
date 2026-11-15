import { z } from "zod";

const account = {
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8),
  password: z.string().min(8),
};

export const restaurantApplicationSchema = z.object({
  manager: z.object(account),
  restaurant: z.object({
    name: z.string().trim().min(2),
    cuisine: z.string().trim().min(2),
    address: z.string().trim().min(3),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    openingHours: z.string().trim().optional(),
  }),
});

export const driverApplicationSchema = z.object({
  ...account,
  vehicle: z.string().trim().min(2),
});