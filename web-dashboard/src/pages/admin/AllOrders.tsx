import { useState } from "react";
import type { ChangeEvent } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, getErrorMessage } from "../../lib/api";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import type { AdminRestaurant, OrdersPage, OrderStatus } from "../../types";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "New" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY", label: "Ready" },
  { value: "ACCEPTED", label: "Driver assigned" },
  { value: "PICKED_UP", label: "Picked up" },
  { value: "DELIVERING", label: "On the way" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const inputClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

export default function AllOrders() {
  const [status, setStatus] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const restaurants = useQuery({
    queryKey: ["admin-restaurants"],
    queryFn: async () =>
      (await api.get<AdminRestaurant[]>("/api/restaurants/admin/all")).data,
  });

  const orders = useQuery({
    queryKey: ["admin-orders", status, restaurantId, from, to, page],
    queryFn: async () =>
      (
        await api.get<OrdersPage>("/api/admin/orders", {
          params: {
            status: status || undefined,
            restaurantId: restaurantId || undefined,
            from: from || undefined,
            to: to || undefined,
            page,
            limit: PAGE_SIZE,
          },
        })
      ).data,
    placeholderData: keepPreviousData,
  });

  // Changing a filter goes back to page 1
  const onFilter =
    (setter: (value: string) => void) =>
    (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  const hasFilters = status || restaurantId || from || to;

  function clearFilters() {
    setStatus("");
    setRestaurantId("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  const result = orders.data;
  const totalPages = result
    ? Math.max(1, Math.ceil(result.total / result.limit))
    : 1;

  return (
    <div className="space-y-5 max-w-6xl">
      <h1 className="text-2xl font-semibold text-slate-800">All orders</h1>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label htmlFor="f-status" className="text-xs text-slate-500">
            Status
          </label>
          <select
            id="f-status"
            value={status}
            onChange={onFilter(setStatus)}
            className={`${inputClass} block`}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="f-restaurant" className="text-xs text-slate-500">
            Restaurant
          </label>
          <select
            id="f-restaurant"
            value={restaurantId}
            onChange={onFilter(setRestaurantId)}
            className={`${inputClass} block`}
          >
            <option value="">All restaurants</option>
            {(restaurants.data ?? []).map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="f-from" className="text-xs text-slate-500">
            From
          </label>
          <input
            id="f-from"
            type="date"
            value={from}
            onChange={onFilter(setFrom)}
            className={`${inputClass} block`}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="f-to" className="text-xs text-slate-500">
            To
          </label>
          <input
            id="f-to"
            type="date"
            value={to}
            onChange={onFilter(setTo)}
            className={`${inputClass} block`}
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:underline pb-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {orders.isLoading && <p className="text-slate-500">Loading orders…</p>}
      {orders.error && (
        <p className="text-red-600 text-sm">{getErrorMessage(orders.error)}</p>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Restaurant</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result && result.data.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            )}

            {result?.data.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium text-slate-800">
                  #{order.id}
                </td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {order.restaurant.name}
                </td>
                <td className="px-4 py-3 text-slate-700">{order.client.name}</td>
                <td className="px-4 py-3 text-slate-700">
                  {order.driver?.user.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-800 whitespace-nowrap">
                  {order.total.toFixed(2)} DT
                </td>
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                  {order.paymentMode === "CASH" ? "Cash" : "Online"} ·{" "}
                  {order.payment?.status === "PAID" ? "Paid" : "Unpaid"}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {result.page} of {totalPages} · {result.total} orders
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}