import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

export async function createDriver(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicle?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new HttpError(409, "Email already used");

  const passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.driver.create({
    data: {
      vehicle: data.vehicle,
      user: {
        create: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          role: "DRIVER",
        },
      },
    },
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  });
}

export function listDrivers() {
  return prisma.driver.findMany({
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  });
}

export async function deleteDriver(id: number) {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: { orders: { select: { id: true }, take: 1 } },
  });
  if (!driver) throw new HttpError(404, "Driver not found");
  if (driver.orders.length > 0) {
    throw new HttpError(400, "This driver already has deliveries");
  }
  await prisma.driver.delete({ where: { id } });
  await prisma.user.delete({ where: { id: driver.userId } });
}

export async function getMyDriver(userId: number) {
  const driver = await prisma.driver.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  });
  if (!driver) throw new HttpError(404, "Driver profile not found");
  return driver;
}

export async function setAvailability(userId: number, available: boolean) {
  const driver = await getMyDriver(userId);
  return prisma.driver.update({ where: { id: driver.id }, data: { available } });
}

export async function setLocation(
  userId: number,
  latitude: number,
  longitude: number
) {
  const driver = await getMyDriver(userId);
  return prisma.driver.update({
    where: { id: driver.id },
    data: { latitude, longitude },
  });
}