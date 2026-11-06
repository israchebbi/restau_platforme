import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

function createToken(user: { id: number; role: string }) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
}

function sanitize<T extends { passwordHash: string }>(user: T) {
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function registerClient(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new HttpError(409, "Email already used");

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
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

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password");

  return { user: sanitize(user), token: createToken(user) };
}

export async function getProfile(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new HttpError(404, "User not found");
  return sanitize(user);
}