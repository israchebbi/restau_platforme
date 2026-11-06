import bcrypt from "bcryptjs";
import { RestaurantStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

export async function createRestaurant(data: {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  logo?: string;
  openingHours?: string;
  commissionRate?: number;
  manager: { name: string; email: string; phone: string; password: string };
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.manager.email },
  });
  if (existing) throw new HttpError(409, "Manager email already used");

  const passwordHash = await bcrypt.hash(data.manager.password, 10);
  const { manager, ...restaurantData } = data;

  return prisma.restaurant.create({
    data: {
      ...restaurantData,
      status: "ACTIVE",
      owner: {
        create: {
          name: manager.name,
          email: manager.email,
          phone: manager.phone,
          passwordHash,
          role: "RESTAURANT",
        },
      },
    },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
}

export function listActiveRestaurants() {
  return prisma.restaurant.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      logo: true,
      address: true,
      latitude: true,
      longitude: true,
      cuisine: true,
      openingHours: true,
    },
  });
}

export function listAllRestaurants() {
  return prisma.restaurant.findMany({
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
}

export async function getRestaurantWithMenu(id: number) {
  const restaurant = await prisma.restaurant.findFirst({
    where: { id, status: "ACTIVE" },
    include: {
      categories: {
        include: { dishes: { where: { available: true } } },
      },
    },
  });
  if (!restaurant) throw new HttpError(404, "Restaurant not found");
  return restaurant;
}

export async function getMyRestaurant(userId: number) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: userId },
  });
  if (!restaurant) throw new HttpError(404, "No restaurant for this account");
  return restaurant;
}

export async function updateMyRestaurant(
  userId: number,
  data: Record<string, unknown>
) {
  const restaurant = await getMyRestaurant(userId);
  return prisma.restaurant.update({ where: { id: restaurant.id }, data });
}

export async function setStatus(id: number, status: RestaurantStatus) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) throw new HttpError(404, "Restaurant not found");
  return prisma.restaurant.update({ where: { id }, data: { status } });
}