import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";

export const authenticate: RequestHandler = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  let payload: { id: number; role: Role };
  try {
    payload = jwt.verify(
      header.slice(7),
      process.env.JWT_SECRET as string
    ) as { id: number; role: Role };
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  const user = await prisma.user.findUnique({
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

export const authorize =
  (...roles: Role[]): RequestHandler =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };