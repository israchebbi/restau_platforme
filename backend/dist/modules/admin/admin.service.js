"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClients = listClients;
exports.listOrders = listOrders;
exports.setBlocked = setBlocked;
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
function listClients() {
    return prisma_1.prisma.user.findMany({
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
async function listOrders(filters) {
    const where = {};
    if (filters.status)
        where.status = filters.status;
    if (filters.restaurantId)
        where.restaurantId = filters.restaurantId;
    if (filters.from || filters.to) {
        where.createdAt = {};
        if (filters.from)
            where.createdAt.gte = filters.from;
        if (filters.to) {
            const end = new Date(filters.to);
            end.setHours(23, 59, 59, 999);
            where.createdAt.lte = end;
        }
    }
    const [total, data] = await Promise.all([
        prisma_1.prisma.order.count({ where }),
        prisma_1.prisma.order.findMany({
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
async function setBlocked(userId, blocked) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new httpError_1.HttpError(404, "User not found");
    if (user.role === "SUPER_ADMIN") {
        throw new httpError_1.HttpError(400, "A super admin cannot be blocked");
    }
    return prisma_1.prisma.user.update({
        where: { id: userId },
        data: { isBlocked: blocked },
        select: { id: true, name: true, email: true, role: true, isBlocked: true },
    });
}
