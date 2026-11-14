import type { OrderStatus } from "../types";

const STYLES: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "New", className: "bg-amber-50 text-amber-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-sky-50 text-sky-700" },
  PREPARING: { label: "Preparing", className: "bg-sky-50 text-sky-700" },
  READY: { label: "Ready", className: "bg-violet-50 text-violet-700" },
  ACCEPTED: { label: "Driver assigned", className: "bg-violet-50 text-violet-700" },
  PICKED_UP: { label: "Picked up", className: "bg-violet-50 text-violet-700" },
  DELIVERING: { label: "On the way", className: "bg-violet-50 text-violet-700" },
  DELIVERED: { label: "Delivered", className: "bg-green-50 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const style = STYLES[status];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${style.className}`}>
      {style.label}
    </span>
  );
}