import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

export const authenticate: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing token" });
    return;
  }
  try {
    const payload = jwt.verify(
      header.slice(7),
      process.env.JWT_SECRET as string
    ) as { id: number; role: Role };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
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