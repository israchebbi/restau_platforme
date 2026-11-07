import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

export function listClients() {
  return prisma.user.findMany({
    where: { role: "CLIENT" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isBlocked: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listOrders(filters: {
  status?: Prisma.OrderWhereInput["status"];
  restaurantId?: number;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
}) {
  const where: Prisma.OrderWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.restaurantId) where.restaurantId = filters.restaurantId;
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = filters.from;
    if (filters.to) {
      const end = new Date(filters.to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        restaurant: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
        driver: { include: { user: { select: { name: true } } } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
  ]);

  return { data, total, page: filters.page, limit: filters.limit };
}

export async function setBlocked(userId: number, blocked: boolean) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "User not found");
  if (user.role === "SUPER_ADMIN") {
    throw new HttpError(400, "A super admin cannot be blocked");
  }
  return prisma.user.update({
    where: { id: userId },
    data: { isBlocked: blocked },
    select: { id: true, name: true, email: true, role: true, isBlocked: true },
  });
}