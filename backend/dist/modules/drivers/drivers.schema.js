"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverStatusSchema = exports.locationSchema = exports.availabilitySchema = exports.createDriverSchema = void 0;
const zod_1 = require("zod");
exports.createDriverSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(8),
    password: zod_1.z.string().min(6),
    vehicle: zod_1.z.string().optional(),
});
exports.availabilitySchema = zod_1.z.object({
    available: zod_1.z.boolean(),
});
exports.locationSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
});
exports.driverStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["APPROVED", "REJECTED"]),
});
