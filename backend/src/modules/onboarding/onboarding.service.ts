import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

async function assertEmailFree(email: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "Email already used");
}

export async function applyRestaurant(data: {
  manager: { name: string; email: string; phone: string; password: string };
  restaurant: {
    name: string;
    cuisine: string;
    address: string;
    latitude: number;
    longitude: number;
    openingHours?: string;
  };
}) {
  await assertEmailFree(data.manager.email);
  const passwordHash = await bcrypt.hash(data.manager.password, 10);

  await prisma.restaurant.create({
    data: {
      ...data.restaurant,
      status: "PENDING",
      owner: {
        create: {
          name: data.manager.name,
          email: data.manager.email,
          phone: data.manager.phone,
          passwordHash,
          role: "RESTAURANT",
        },
      },
    },
  });

  return { message: "Application received" };
}

export async function applyDriver(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicle: string;
}) {
  await assertEmailFree(data.email);
  const passwordHash = await bcrypt.hash(data.password, 10);

  await prisma.driver.create({
    data: {
      vehicle: data.vehicle,
      status: "PENDING",
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
  });

  return { message: "Application received" };
}