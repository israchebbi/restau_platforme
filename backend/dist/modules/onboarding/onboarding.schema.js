"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverApplicationSchema = exports.restaurantApplicationSchema = void 0;
const zod_1 = require("zod");
const account = {
    name: zod_1.z.string().trim().min(2),
    email: zod_1.z.string().trim().email(),
    phone: zod_1.z.string().trim().min(8),
    password: zod_1.z.string().min(8),
};
exports.restaurantApplicationSchema = zod_1.z.object({
    manager: zod_1.z.object(account),
    restaurant: zod_1.z.object({
        name: zod_1.z.string().trim().min(2),
        cuisine: zod_1.z.string().trim().min(2),
        address: zod_1.z.string().trim().min(3),
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
        openingHours: zod_1.z.string().trim().optional(),
    }),
});
exports.driverApplicationSchema = zod_1.z.object({
    ...account,
    vehicle: zod_1.z.string().trim().min(2),
});
