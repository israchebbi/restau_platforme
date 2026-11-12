import type { OrderStatus } from "../../types";

const LABELS: Record<OrderStatus, string> = {
  PENDING: "New",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  ACCEPTED: "Driver assigned",
  PICKED_UP: "Picked up",
  DELIVERING: "On the way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function StatusBreakdown({
  counts,
}: {
  counts: Partial<Record<OrderStatus, number>>;
}) {
  const statuses = (Object.keys(LABELS) as OrderStatus[]).filter(
    (status) => counts[status]
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h2 className="font-medium text-slate-800 mb-3">Orders by status</h2>

      {statuses.length === 0 && (
        <p className="text-sm text-slate-400">No orders yet.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <span
            key={status}
            className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700"
          >
            {LABELS[status]}: <strong>{counts[status]}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}