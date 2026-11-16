"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusSchema = exports.updateRestaurantSchema = exports.createRestaurantSchema = void 0;
const zod_1 = require("zod");
exports.createRestaurantSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    address: zod_1.z.string().min(3),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    cuisine: zod_1.z.string().min(2),
    logo: zod_1.z.string().url().optional(),
    openingHours: zod_1.z.string().optional(),
    commissionRate: zod_1.z.number().min(0).max(1).optional(),
    manager: zod_1.z.object({
        name: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(8),
        password: zod_1.z.string().min(6),
    }),
});
exports.updateRestaurantSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    address: zod_1.z.string().min(3).optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    cuisine: zod_1.z.string().min(2).optional(),
    logo: zod_1.z.string().url().optional(),
    openingHours: zod_1.z.string().optional(),
});
exports.statusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "ACTIVE", "SUSPENDED"]),
});
