export type Role = "SUPER_ADMIN" | "RESTAURANT" | "CLIENT" | "DRIVER";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
}