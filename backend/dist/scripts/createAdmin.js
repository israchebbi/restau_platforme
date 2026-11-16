"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
async function main() {
    const email = process.env.ADMIN_EMAIL ?? "admin@platform.com";
    const passwordHash = await bcryptjs_1.default.hash(process.env.ADMIN_PASSWORD ?? "Admin123!", 10);
    await prisma_1.prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            name: "Super Admin",
            email,
            phone: "00000000",
            passwordHash,
            role: "SUPER_ADMIN",
        },
    });
    console.log("Super admin ready:", email);
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(() => prisma_1.prisma.$disconnect());
