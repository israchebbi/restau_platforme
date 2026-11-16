"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dishUpdateSchema = exports.dishSchema = exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
});
exports.dishSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive(),
    image: zod_1.z.string().url().optional(),
    available: zod_1.z.boolean().optional(),
    categoryId: zod_1.z.number().int(),
});
exports.dishUpdateSchema = exports.dishSchema.partial();
