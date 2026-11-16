"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDriver = createDriver;
exports.listDrivers = listDrivers;
exports.deleteDriver = deleteDriver;
exports.getMyDriver = getMyDriver;
exports.setAvailability = setAvailability;
exports.setLocation = setLocation;
exports.setDriverStatus = setDriverStatus;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
async function createDriver(data) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new httpError_1.HttpError(409, "Email already used");
    const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
    return prisma_1.prisma.driver.create({
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
function listDrivers() {
    return prisma_1.prisma.driver.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true, phone: true, isBlocked: true },
            },
        },
    });
}
async function deleteDriver(id) {
    const driver = await prisma_1.prisma.driver.findUnique({
        where: { id },
        include: { orders: { select: { id: true }, take: 1 } },
    });
    if (!driver)
        throw new httpError_1.HttpError(404, "Driver not found");
    if (driver.orders.length > 0) {
        throw new httpError_1.HttpError(400, "This driver already has deliveries");
    }
    await prisma_1.prisma.driver.delete({ where: { id } });
    await prisma_1.prisma.user.delete({ where: { id: driver.userId } });
}
async function getMyDriver(userId) {
    const driver = await prisma_1.prisma.driver.findUnique({
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });
    if (!driver)
        throw new httpError_1.HttpError(404, "Driver profile not found");
    return driver;
}
async function setAvailability(userId, available) {
    const driver = await getMyDriver(userId);
    return prisma_1.prisma.driver.update({ where: { id: driver.id }, data: { available } });
}
async function setLocation(userId, latitude, longitude) {
    const driver = await getMyDriver(userId);
    return prisma_1.prisma.driver.update({
        where: { id: driver.id },
        data: { latitude, longitude },
    });
}
async function setDriverStatus(id, status) {
    const driver = await prisma_1.prisma.driver.findUnique({ where: { id } });
    if (!driver)
        throw new httpError_1.HttpError(404, "Driver not found");
    return prisma_1.prisma.driver.update({
        where: { id },
        data: { status, ...(status === "REJECTED" ? { available: false } : {}) },
    });
}
