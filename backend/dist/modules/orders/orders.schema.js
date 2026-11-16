"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryStatusSchema = exports.restaurantStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    restaurantId: zod_1.z.number().int(),
    items: zod_1.z
        .array(zod_1.z.object({
        dishId: zod_1.z.number().int(),
        quantity: zod_1.z.number().int().min(1).max(50),
    }))
        .min(1),
    paymentMode: zod_1.z.enum(["ONLINE", "CASH"]),
    address: zod_1.z.string().min(3),
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    phone: zod_1.z.string().min(8),
});
exports.restaurantStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["CONFIRMED", "PREPARING", "READY", "CANCELLED"]),
});
exports.deliveryStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["PICKED_UP", "DELIVERING", "DELIVERED"]),
});
