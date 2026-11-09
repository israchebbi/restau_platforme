import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "../../lib/api";
import { useOrderEvents } from "../../hooks/userOrderEvents";
import type { Order, OrderStatus } from "../../types";

interface Action {
  label: string;
  status: OrderStatus;
  danger?: boolean;
}

const ACTIONS: Partial<Record<OrderStatus, Action[]>> = {
  PENDING: [
    { label: "Confirm", status: "CONFIRMED" },
    { label: "Reject", status: "CANCELLED", danger: true },
  ],
  CONFIRMED: [{ label: "Start preparing", status: "PREPARING" }],
  PREPARING: [{ label: "Mark as ready", status: "READY" }],
};

const COLUMNS: { title: string; statuses: OrderStatus[] }[] = [
  { title: "New", statuses: ["PENDING"] },
  { title: "In the kitchen", statuses: ["CONFIRMED", "PREPARING"] },
  { title: "Ready for pickup", statuses: ["READY"] },
  { title: "With the driver", statuses: ["ACCEPTED", "PICKED_UP", "DELIVERING"] },
];

const STATUS_LABELS: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  ACCEPTED: "Driver assigned",
  PICKED_UP: "Picked up",
  DELIVERING: "On the way",
};

function OrderCard({
  order,
  busy,
  onAction,
}: {
  order: Order;
  busy: boolean;
  onAction: (status: OrderStatus) => void;
}) {
  const time = new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const actions = ACTIONS[order.status] ?? [];
  const label = STATUS_LABELS[order.status];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-800">#{order.id}</span>
        <span className="text-sm font-medium text-slate-800">
          {order.total.toFixed(2)} DT
        </span>
      </div>

      <div className="text-xs text-slate-500">
        {time} · {order.client.name} ·{" "}
        {order.paymentMode === "CASH" ? "Cash on delivery" : "Online payment"}
      </div>

      {label && (
        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
          {label}
        </span>
      )}

      <ul className="text-sm text-slate-700">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity} × {item.dish.name}
          </li>
        ))}
      </ul>

      {order.driver && (
        <div className="text-xs text-slate-500">
          Driver: {order.driver.user.name}
        </div>
      )}

      {actions.length > 0 && (
        <div className="flex gap-2 pt-1">
          {actions.map((action) => (
            <button
              key={action.status}
              disabled={busy}
              onClick={() => onAction(action.status)}
              className={
                action.danger
                  ? "flex-1 rounded-lg border border-red-300 text-red-700 text-sm py-1.5 hover:bg-red-50 disabled:opacity-50"
                  : "flex-1 rounded-lg bg-orange-600 text-white text-sm py-1.5 hover:bg-orange-700 disabled:opacity-50"
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState("");

  const connected = useOrderEvents(() => {
    setNotice("New order received");
    setTimeout(() => setNotice(""), 4000);
  });

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["restaurant-orders"],
    queryFn: async () =>
      (await api.get<Order[]>("/api/orders/restaurant")).data,
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      api.patch(`/api/orders/${id}/status`, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Live orders</h1>
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            connected
              ? "bg-green-50 text-green-700"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {connected ? "Live" : "Offline"}
        </span>
      </div>

      {notice && (
        <div className="rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-sm px-3 py-2">
          {notice}
        </div>
      )}

      {changeStatus.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {getErrorMessage(changeStatus.error)}
        </div>
      )}

      {isLoading && <p className="text-slate-500">Loading orders…</p>}
      {error && (
        <p className="text-red-600 text-sm">{getErrorMessage(error)}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter((o) =>
            column.statuses.includes(o.status)
          );
          return (
            <div key={column.title} className="space-y-3">
              <h2 className="text-sm font-medium text-slate-600">
                {column.title} ({columnOrders.length})
              </h2>
              {columnOrders.length === 0 && (
                <div className="text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg p-4 text-center">
                  No orders
                </div>
              )}
              {columnOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  busy={changeStatus.isPending}
                  onAction={(status) =>
                    changeStatus.mutate({ id: order.id, status })
                  }
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}