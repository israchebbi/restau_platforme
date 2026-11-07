import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";
import { setIO } from "./io";

export function initSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  // Only authenticated users can connect
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing token"));
    try {
      socket.data.user = jwt.verify(token, process.env.JWT_SECRET as string);
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const { id, role } = socket.data.user as { id: number; role: Role };

    socket.join(`user:${id}`);
    if (role === "DRIVER") socket.join("drivers");
    if (role === "RESTAURANT") {
      const restaurant = await prisma.restaurant.findUnique({
        where: { ownerId: id },
      });
      if (restaurant) socket.join(`restaurant:${restaurant.id}`);
    }
  });

  setIO(io);
  return io;
}