import type { Role } from "../types";

export const homeFor = (role: Role) =>
  role === "SUPER_ADMIN" ? "/admin/overview" : "/restaurant/orders";