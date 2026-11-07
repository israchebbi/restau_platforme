import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

type Scope = { restaurantId?: number };

const round2 = (n: number) => Math.round(n * 100) / 100;

const deliveredWhere = (scope: Scope): Prisma.OrderWhereInput => ({
  status: "DELIVERED",
  ...(scope.restaurantId ? { restaurantId: scope.restaurantId } : {}),
});

// Local date as YYYY-MM-DD (avoids UTC shifts)
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export async function getRestaurantIdOfOwner(userId: number) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: userId },
  });
  if (!restaurant) throw new HttpError(404, "No restaurant for this account");
  return restaurant.id;
}

export async function getOverview(scope: Scope = {}) {
  const allWhere: Prisma.OrderWhereInput = scope.restaurantId
    ? { restaurantId: scope.restaurantId }
    : {};

  const [byStatus, delivered, commission] = await Promise.all([
    prisma.order.groupBy({
      by: ["status"],
      where: allWhere,
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: deliveredWhere(scope),
      _count: { _all: true },
      _sum: { total: true, deliveryFee: true },
      _avg: { total: true },
    }),
    prisma.payment.aggregate({
      where: { order: deliveredWhere(scope) },
      _sum: { commission: true },
    }),
  ]);

  const sales = round2(
    (delivered._sum.total ?? 0) - (delivered._sum.deliveryFee ?? 0)
  );
  const platformCommission = round2(commission._sum.commission ?? 0);

  return {
    totalOrders: byStatus.reduce((sum, s) => sum + s._count._all, 0),
    ordersByStatus: Object.fromEntries(
      byStatus.map((s) => [s.status, s._count._all])
    ),
    deliveredOrders: delivered._count._all,
    sales,
    deliveryFees: round2(delivered._sum.deliveryFee ?? 0),
    platformCommission,
    restaurantNet: round2(sales - platformCommission),
    averageOrderValue: round2(delivered._avg.total ?? 0),
  };
}

export async function getPlatformCounts() {
  const [activeRestaurants, pendingRestaurants, drivers, availableDrivers, clients] =
    await Promise.all([
      prisma.restaurant.count({ where: { status: "ACTIVE" } }),
      prisma.restaurant.count({ where: { status: "PENDING" } }),
      prisma.driver.count(),
      prisma.driver.count({ where: { available: true } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
    ]);
  return { activeRestaurants, pendingRestaurants, drivers, availableDrivers, clients };
}

export async function getDaily(scope: Scope, days: number) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: since },
      ...(scope.restaurantId ? { restaurantId: scope.restaurantId } : {}),
    },
    select: { createdAt: true, status: true, total: true, deliveryFee: true },
  });

  // One entry per day, even for days without orders
  const result = new Map<string, { date: string; orders: number; sales: number }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = dayKey(d);
    result.set(key, { date: key, orders: 0, sales: 0 });
  }

  for (const order of orders) {
    const entry = result.get(dayKey(order.createdAt));
    if (!entry) continue;
    entry.orders += 1;
    if (order.status === "DELIVERED") {
      entry.sales = round2(entry.sales + order.total - order.deliveryFee);
    }
  }
  return [...result.values()];
}

export async function getTopDishes(scope: Scope, limit: number) {
  const grouped = await prisma.orderItem.groupBy({
    by: ["dishId"],
    where: { order: deliveredWhere(scope) },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const dishes = await prisma.dish.findMany({
    where: { id: { in: grouped.map((g) => g.dishId) } },
    select: {
      id: true,
      name: true,
      category: { select: { restaurant: { select: { name: true } } } },
    },
  });
  const byId = new Map(dishes.map((d) => [d.id, d]));

  return grouped.map((g) => ({
    dishId: g.dishId,
    name: byId.get(g.dishId)?.name ?? "Unknown",
    restaurant: byId.get(g.dishId)?.category.restaurant.name,
    quantity: g._sum.quantity ?? 0,
  }));
}

export async function getRestaurantsStats() {
  const [grouped, payments, restaurants] = await Promise.all([
    prisma.order.groupBy({
      by: ["restaurantId"],
      where: { status: "DELIVERED" },
      _count: { _all: true },
      _sum: { total: true, deliveryFee: true },
    }),
    prisma.payment.findMany({
      where: { order: { status: "DELIVERED" } },
      select: { commission: true, order: { select: { restaurantId: true } } },
    }),
    prisma.restaurant.findMany({ select: { id: true, name: true, status: true } }),
  ]);

  const commissionByRestaurant = new Map<number, number>();
  for (const p of payments) {
    const id = p.order.restaurantId;
    commissionByRestaurant.set(id, (commissionByRestaurant.get(id) ?? 0) + p.commission);
  }
  const statsByRestaurant = new Map(grouped.map((g) => [g.restaurantId, g]));

  return restaurants.map((r) => {
    const g = statsByRestaurant.get(r.id);
    const sales = round2((g?._sum.total ?? 0) - (g?._sum.deliveryFee ?? 0));
    const commission = round2(commissionByRestaurant.get(r.id) ?? 0);
    return {
      restaurantId: r.id,
      name: r.name,
      status: r.status,
      deliveredOrders: g?._count._all ?? 0,
      sales,
      commission,
      net: round2(sales - commission),
    };
  });
}