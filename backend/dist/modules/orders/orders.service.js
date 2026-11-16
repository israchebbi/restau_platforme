"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.listMyOrders = listMyOrders;
exports.cancelOrder = cancelOrder;
exports.listRestaurantOrders = listRestaurantOrders;
exports.updateRestaurantStatus = updateRestaurantStatus;
exports.listAvailableOrders = listAvailableOrders;
exports.acceptOrder = acceptOrder;
exports.updateDeliveryStatus = updateDeliveryStatus;
exports.listDriverOrders = listDriverOrders;
exports.getOrder = getOrder;
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
const io_1 = require("../../sockets/io");
const DELIVERY_FEE = 3;
const RESTAURANT_TRANSITIONS = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PREPARING", "CANCELLED"],
    PREPARING: ["READY"],
};
const DRIVER_TRANSITIONS = {
    ACCEPTED: ["PICKED_UP"],
    PICKED_UP: ["DELIVERING"],
    DELIVERING: ["DELIVERED"],
};
const round2 = (n) => Math.round(n * 100) / 100;
const orderDetails = {
    items: { include: { dish: { select: { name: true } } } },
    restaurant: { select: { id: true, name: true, address: true } },
    payment: true,
};
async function getRestaurantByOwner(userId) {
    const restaurant = await prisma_1.prisma.restaurant.findUnique({
        where: { ownerId: userId },
    });
    if (!restaurant)
        throw new httpError_1.HttpError(404, "No restaurant for this account");
    return restaurant;
}
async function getDriverByUser(userId) {
    const driver = await prisma_1.prisma.driver.findUnique({ where: { userId } });
    if (!driver)
        throw new httpError_1.HttpError(404, "Driver profile not found");
    return driver;
}
// ---------- Client ----------
async function createOrder(clientId, data) {
    const restaurant = await prisma_1.prisma.restaurant.findFirst({
        where: { id: data.restaurantId, status: "ACTIVE" },
    });
    if (!restaurant)
        throw new httpError_1.HttpError(404, "Restaurant not found");
    const dishIds = [...new Set(data.items.map((i) => i.dishId))];
    const dishes = await prisma_1.prisma.dish.findMany({
        where: {
            id: { in: dishIds },
            available: true,
            category: { restaurantId: restaurant.id },
        },
    });
    if (dishes.length !== dishIds.length) {
        throw new httpError_1.HttpError(400, "Some dishes are unavailable or do not belong to this restaurant");
    }
    const priceById = new Map(dishes.map((d) => [d.id, d.price]));
    const subtotal = data.items.reduce((sum, item) => sum + priceById.get(item.dishId) * item.quantity, 0);
    const total = round2(subtotal + DELIVERY_FEE);
    const commission = round2(subtotal * restaurant.commissionRate);
    const order = await prisma_1.prisma.order.create({
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
                    price: priceById.get(item.dishId),
                })),
            },
            payment: { create: { amount: total, commission } },
        },
        include: orderDetails,
    });
    (0, io_1.emit)(`restaurant:${restaurant.id}`, "order:new", order);
    return order;
}
function listMyOrders(clientId) {
    return prisma_1.prisma.order.findMany({
        where: { clientId },
        include: orderDetails,
        orderBy: { createdAt: "desc" },
    });
}
async function cancelOrder(clientId, orderId) {
    const order = await prisma_1.prisma.order.findFirst({
        where: { id: orderId, clientId },
    });
    if (!order)
        throw new httpError_1.HttpError(404, "Order not found");
    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
        throw new httpError_1.HttpError(400, "This order can no longer be cancelled");
    }
    const updated = await prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
    });
    (0, io_1.emit)(`restaurant:${updated.restaurantId}`, "order:cancelled", { orderId });
    return updated;
}
// ---------- Restaurant ----------
async function listRestaurantOrders(userId, status) {
    const restaurant = await getRestaurantByOwner(userId);
    return prisma_1.prisma.order.findMany({
        where: { restaurantId: restaurant.id, ...(status ? { status } : {}) },
        include: {
            items: { include: { dish: { select: { name: true } } } },
            client: { select: { name: true } },
            driver: { include: { user: { select: { name: true, phone: true } } } },
        },
        orderBy: { createdAt: "desc" },
    });
}
async function updateRestaurantStatus(userId, orderId, status) {
    const restaurant = await getRestaurantByOwner(userId);
    const order = await prisma_1.prisma.order.findFirst({
        where: { id: orderId, restaurantId: restaurant.id },
    });
    if (!order)
        throw new httpError_1.HttpError(404, "Order not found");
    const allowed = RESTAURANT_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
        throw new httpError_1.HttpError(400, `Cannot change status from ${order.status} to ${status}`);
    }
    const updated = await prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
    (0, io_1.emit)(`user:${updated.clientId}`, "order:status", { orderId, status });
    if (status === "READY")
        (0, io_1.emit)("drivers", "order:available", { orderId });
    return updated;
}
// ---------- Driver ----------
async function listAvailableOrders(userId) {
    const driver = await getDriverByUser(userId);
    if (driver.status !== "APPROVED") {
        throw new httpError_1.HttpError(403, "Your account is waiting for approval");
    }
    return prisma_1.prisma.order.findMany({
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
async function acceptOrder(userId, orderId) {
    const driver = await getDriverByUser(userId);
    if (driver.status !== "APPROVED") {
        throw new httpError_1.HttpError(403, "Your account is waiting for approval");
    }
    if (!driver.available) {
        throw new httpError_1.HttpError(400, "Set yourself as available first");
    }
    // Atomic: the update only succeeds if the order is still free
    const result = await prisma_1.prisma.order.updateMany({
        where: { id: orderId, status: "READY", driverId: null },
        data: { status: "ACCEPTED", driverId: driver.id },
    });
    if (result.count === 0) {
        throw new httpError_1.HttpError(409, "This order is no longer available");
    }
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: { include: { dish: { select: { name: true } } } },
            restaurant: {
                select: { name: true, address: true, latitude: true, longitude: true },
            },
            client: { select: { name: true, phone: true } },
        },
    });
    (0, io_1.emit)("drivers", "order:taken", { orderId });
    if (order) {
        (0, io_1.emit)(`user:${order.clientId}`, "order:status", { orderId, status: "ACCEPTED" });
        (0, io_1.emit)(`restaurant:${order.restaurantId}`, "order:status", { orderId, status: "ACCEPTED" });
    }
    return order;
}
async function updateDeliveryStatus(userId, orderId, status) {
    const driver = await getDriverByUser(userId);
    const order = await prisma_1.prisma.order.findFirst({
        where: { id: orderId, driverId: driver.id },
    });
    if (!order)
        throw new httpError_1.HttpError(404, "Order not found");
    const allowed = DRIVER_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
        throw new httpError_1.HttpError(400, `Cannot change status from ${order.status} to ${status}`);
    }
    const updated = await prisma_1.prisma.$transaction(async (tx) => {
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
    (0, io_1.emit)(`user:${updated.clientId}`, "order:status", { orderId, status });
    (0, io_1.emit)(`restaurant:${updated.restaurantId}`, "order:status", { orderId, status });
    return updated;
}
async function listDriverOrders(userId) {
    const driver = await getDriverByUser(userId);
    return prisma_1.prisma.order.findMany({
        where: { driverId: driver.id },
        include: {
            restaurant: { select: { name: true, address: true } },
            client: { select: { name: true, phone: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}
// ---------- One order ----------
async function getOrder(user, orderId) {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: { include: { dish: { select: { name: true } } } },
            restaurant: { select: { id: true, name: true, address: true, ownerId: true } },
            driver: { include: { user: { select: { name: true, phone: true } } } },
            client: { select: { id: true, name: true, phone: true } },
            payment: true,
        },
    });
    if (!order)
        throw new httpError_1.HttpError(404, "Order not found");
    const allowed = user.role === "SUPER_ADMIN" ||
        order.clientId === user.id ||
        order.restaurant.ownerId === user.id ||
        order.driver?.userId === user.id;
    if (!allowed)
        throw new httpError_1.HttpError(403, "Forbidden");
    return order;
}
