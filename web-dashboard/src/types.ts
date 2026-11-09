export type Role = "SUPER_ADMIN" | "RESTAURANT" | "CLIENT" | "DRIVER";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
}
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "ACCEPTED"
  | "PICKED_UP"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMode = "ONLINE" | "CASH";

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  dish: { name: string };
}

export interface Order {
  id: number;
  status: OrderStatus;
  paymentMode: PaymentMode;
  total: number;
  deliveryFee: number;
  address: string;
  createdAt: string;
  items: OrderItem[];
  client: { name: string };
  driver: { user: { name: string; phone: string } } | null;
}