"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const authenticate = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing token" });
        return;
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(header.slice(7), process.env.JWT_SECRET);
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: payload.id },
        select: { isBlocked: true },
    });
    if (!user) {
        res.status(401).json({ message: "User no longer exists" });
        return;
    }
    if (user.isBlocked) {
        res.status(403).json({ message: "Account blocked" });
        return;
    }
    req.user = { id: payload.id, role: payload.role };
    next();
};
exports.authenticate = authenticate;
const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    next();
};
exports.authorize = authorize;
