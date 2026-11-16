"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRestaurant = applyRestaurant;
exports.applyDriver = applyDriver;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
async function assertEmailFree(email) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        throw new httpError_1.HttpError(409, "Email already used");
}
async function applyRestaurant(data) {
    await assertEmailFree(data.manager.email);
    const passwordHash = await bcryptjs_1.default.hash(data.manager.password, 10);
    await prisma_1.prisma.restaurant.create({
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
async function applyDriver(data) {
    await assertEmailFree(data.email);
    const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
    await prisma_1.prisma.driver.create({
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
