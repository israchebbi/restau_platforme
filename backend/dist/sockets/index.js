"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const io_1 = require("./io");
const cors_1 = require("../config/cors");
function initSocket(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: { origin: cors_1.allowedOrigins?.length ? cors_1.allowedOrigins : "*" },
    });
    // Only authenticated users can connect
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token)
            return next(new Error("Missing token"));
        try {
            socket.data.user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            next();
        }
        catch {
            next(new Error("Invalid token"));
        }
    });
    io.on("connection", async (socket) => {
        const { id, role } = socket.data.user;
        socket.join(`user:${id}`);
        if (role === "DRIVER")
            socket.join("drivers");
        if (role === "RESTAURANT") {
            const restaurant = await prisma_1.prisma.restaurant.findUnique({
                where: { ownerId: id },
            });
            if (restaurant)
                socket.join(`restaurant:${restaurant.id}`);
        }
    });
    (0, io_1.setIO)(io);
    return io;
}
