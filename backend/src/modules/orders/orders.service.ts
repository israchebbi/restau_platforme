import { OrderStatus, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

const DELIVERY_FEE = 3;

type Transitions = Partial<Record<OrderStatus, OrderStatus[]>>;

const RESTAURANT_TRANSITIONS: Transitions = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
};

const DRIVER_TRANSITIONS: Transitions = {
  ACCEPTED: ["PICKED_UP"],
  PICKED_UP: ["DELIVERING"],
  DELIVERING: ["DELIVERED"],
};

const round2 = (n: number) => Math.round(n * 100) / 100;

const orderDetails = {
  items: { include: { dish: { select: { name: true } } } },
  restaurant: { select: { id: true, name: true, address: true } },
  payment: true,
};

async function getRestaurantByOwner(userId: number) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: userId },
  });
  if (!restaurant) throw new HttpError(404, "No restaurant for this account");
  return restaurant;
}

async function getDriverByUser(userId: number) {
  const driver = await prisma.driver.findUnique({ where: { userId } });
  if (!driver) throw new HttpError(404, "Driver profile not found");
  return driver;
}

// ---------- Client ----------
export async function createOrder(
  clientId: number,
  data: {
    restaurantId: number;
    items: { dishId: number; quantity: number }[];
    paymentMode: "ONLINE" | "CASH";
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
  }
) {
  const restaurant = await prisma.restaurant.findFirst({
    where: { id: data.restaurantId, status: "ACTIVE" },
  });
  if (!restaurant) throw new HttpError(404, "Restaurant not found");

  const dishIds = [...new Set(data.items.map((i) => i.dishId))];
  const dishes = await prisma.dish.findMany({
    where: {
      id: { in: dishIds },
      available: true,
      category: { restaurantId: restaurant.id },
    },
  });
  if (dishes.length !== dishIds.length) {
    throw new HttpError(
      400,
      "Some dishes are unavailable or do not belong to this restaurant"
    );
  }

  const priceById = new Map(dishes.map((d) => [d.id, d.price]));
  const subtotal = data.items.reduce(
    (sum, item) => sum + priceById.get(item.dishId)! * item.quantity,
    0
  );
  const total = round2(subtotal + DELIVERY_FEE);
  const commission = round2(subtotal * restaurant.commissionRate);

  return prisma.order.create({
    data: {
      paymentMode: data.paymentMode,
      total,
      deliveryFee: DELIVERY_FEE,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone,
      clientId,
      restaurantId: restaurant.id,
      items: {
        create: data.items.map((item) => ({
          dishId: item.dishId,
          quantity: item.quantity,
          price: priceById.get(item.dishId)!,
        })),
      },
      payment: { create: { amount: total, commission } },
    },
    include: orderDetails,
  });
}

export function listMyOrders(clientId: number) {
  return prisma.order.findMany({
    where: { clientId },
    include: orderDetails,
    orderBy: { createdAt: "desc" },
  });
}

export async function cancelOrder(clientId: number, orderId: number) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, clientId },
  });
  if (!order) throw new HttpError(404, "Order not found");
  if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
    throw new HttpError(400, "This order can no longer be cancelled");
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
}

// ---------- Restaurant ----------
export async function listRestaurantOrders(userId: number, status?: OrderStatus) {
  const restaurant = await getRestaurantByOwner(userId);
  return prisma.order.findMany({
    where: { restaurantId: restaurant.id, ...(status ? { status } : {}) },
    include: {
      items: { include: { dish: { select: { name: true } } } },
      client: { select: { name: true } },
      driver: { include: { user: { select: { name: true, phone: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateRestaurantStatus(
  userId: number,
  orderId: number,
  status: OrderStatus
) {
  const restaurant = await getRestaurantByOwner(userId);
  const order = await prisma.order.findFirst({
    where: { id: orderId, restaurantId: restaurant.id },
  });
  if (!order) throw new HttpError(404, "Order not found");

  const allowed = RESTAURANT_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(status)) {
    throw new HttpError(400, `Cannot change status from ${order.status} to ${status}`);
  }
  return prisma.order.update({ where: { id: orderId }, data: { status } });
}

// ---------- Driver ----------
export function listAvailableOrders() {
  return prisma.order.findMany({
    where: { status: "READY", driverId: null },
    select: {
      id: true,
      total: true,
      deliveryFee: true,
      paymentMode: true,
      createdAt: true,
      restaurant: {
        select: { name: true, address: true, latitude: true, longitude: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function acceptOrder(userId: number, orderId: number) {
  const driver = await getDriverByUser(userId);
  if (!driver.available) {
    throw new HttpError(400, "Set yourself as available first");
  }

  // Atomic: the update only succeeds if the order is still free
  const result = await prisma.order.updateMany({
    where: { id: orderId, status: "READY", driverId: null },
    data: { status: "ACCEPTED", driverId: driver.id },
  });
  if (result.count === 0) {
    throw new HttpError(409, "This order is no longer available");
  }

  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { dish: { select: { name: true } } } },
      restaurant: {
        select: { name: true, address: true, latitude: true, longitude: true },
      },
      client: { select: { name: true, phone: true } },
    },
  });
}

export async function updateDeliveryStatus(
  userId: number,
  orderId: number,
  status: OrderStatus
) {
  const driver = await getDriverByUser(userId);
  const order = await prisma.order.findFirst({
    where: { id: orderId, driverId: driver.id },
  });
  if (!order) throw new HttpError(404, "Order not found");

  const allowed = DRIVER_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(status)) {
    throw new HttpError(400, `Cannot change status from ${order.status} to ${status}`);
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status },
    });
    if (status === "DELIVERED" && order.paymentMode === "CASH") {
      await tx.payment.updateMany({
        where: { orderId },
        data: { status: "PAID" },
      });
    }
    return updated;
  });
}

export async function listDriverOrders(userId: number) {
  const driver = await getDriverByUser(userId);
  return prisma.order.findMany({
    where: { driverId: driver.id },
    include: {
      restaurant: { select: { name: true, address: true } },
      client: { select: { name: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ---------- One order ----------
export async function getOrder(user: { id: number; role: Role }, orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { dish: { select: { name: true } } } },
      restaurant: { select: { id: true, name: true, address: true, ownerId: true } },
      driver: { include: { user: { select: { name: true, phone: true } } } },
      client: { select: { id: true, name: true, phone: true } },
      payment: true,
    },
  });
  if (!order) throw new HttpError(404, "Order not found");

  const allowed =
    user.role === "SUPER_ADMIN" ||
    order.clientId === user.id ||
    order.restaurant.ownerId === user.id ||
    order.driver?.userId === user.id;
  if (!allowed) throw new HttpError(403, "Forbidden");

  return order;
}