"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersQuerySchema = exports.blockSchema = void 0;
const zod_1 = require("zod");
exports.blockSchema = zod_1.z.object({
    blocked: zod_1.z.boolean(),
});
exports.ordersQuerySchema = zod_1.z.object({
    status: zod_1.z
        .enum([
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "ACCEPTED",
        "PICKED_UP",
        "DELIVERING",
        "DELIVERED",
        "CANCELLED",
    ])
        .optional(),
    restaurantId: zod_1.z.coerce.number().int().optional(),
    from: zod_1.z.coerce.date().optional(),
    to: zod_1.z.coerce.date().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
