"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClient = registerClient;
exports.login = login;
exports.getProfile = getProfile;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
function sanitize(user) {
    const { passwordHash, ...safe } = user;
    return safe;
}
async function registerClient(data) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new httpError_1.HttpError(409, "Email already used");
    const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            passwordHash,
            role: "CLIENT",
        },
    });
    return { user: sanitize(user), token: createToken(user) };
}
async function login(email, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new httpError_1.HttpError(401, "Invalid email or password");
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok)
        throw new httpError_1.HttpError(401, "Invalid email or password");
    if (user.isBlocked)
        throw new httpError_1.HttpError(403, "Account blocked");
    return { user: sanitize(user), token: createToken(user) };
}
async function getProfile(id) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new httpError_1.HttpError(404, "User not found");
    return sanitize(user);
}
