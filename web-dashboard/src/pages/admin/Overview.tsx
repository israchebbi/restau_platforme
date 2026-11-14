import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, getErrorMessage } from "../../lib/api";
import StatCard from "../../components/stats/StatCard";
import DailyCharts from "../../components/stats/DailyCharts";
import TopDishes from "../../components/stats/TopDishes";
import StatusBreakdown from "../../components/stats/StatusBreakdown";
import type {
  AdminOverview,
  DailyStat,
  RestaurantStat,
  TopDish,
} from "../../types";

const money = (n: number) => `${n.toFixed(2)} DT`;
const RANGES = [7, 14, 30];

export default function Overview() {
  const [days, setDays] = useState(7);

  const overview = useQuery({
    queryKey: ["stats", "admin", "overview"],
    queryFn: async () =>
      (await api.get<AdminOverview>("/api/stats/admin/overview")).data,
  });

  const daily = useQuery({
    queryKey: ["stats", "admin", "daily", days],
    queryFn: async () =>
      (await api.get<DailyStat[]>(`/api/stats/admin/daily?days=${days}`)).data,
  });

  const restaurants = useQuery({
    queryKey: ["stats", "admin", "restaurants"],
    queryFn: async () =>
      (await api.get<RestaurantStat[]>("/api/stats/admin/restaurants")).data,
  });

  const topDishes = useQuery({
    queryKey: ["stats", "admin", "top-dishes"],
    queryFn: async () =>
      (await api.get<TopDish[]>("/api/stats/admin/top-dishes?limit=5")).data,
  });

  const error =
    overview.error ?? daily.error ?? restaurants.error ?? topDishes.error;
  const stats = overview.data;

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Overview</h1>

        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setDays(range)}
              className={`text-sm px-3 py-1 rounded-md ${
                days === range
                  ? "bg-orange-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {range} days
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {getErrorMessage(error)}
        </div>
      )}

      {overview.isLoading && <p className="text-slate-500">Loading…</p>}

      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Platform commission"
            value={money(stats.platformCommission)}
            hint="Earned on delivered orders"
          />
          <StatCard
            label="Restaurant sales"
            value={money(stats.sales)}
            hint="Delivery fees excluded"
          />
          <StatCard
            label="Delivered orders"
            value={String(stats.deliveredOrders)}
          />
          <StatCard label="Total orders" value={String(stats.totalOrders)} />
          <StatCard
            label="Active restaurants"
            value={String(stats.activeRestaurants)}
            hint={`${stats.pendingRestaurants} pending`}
          />
          <StatCard
            label="Drivers"
            value={String(stats.drivers)}
            hint={`${stats.availableDrivers} available now`}
          />
          <StatCard label="Clients" value={String(stats.clients)} />
          <StatCard
            label="Average order"
            value={money(stats.averageOrderValue)}
            hint="Delivery fee included"
          />
        </div>
      )}

      {daily.data && <DailyCharts data={daily.data} />}

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <h2 className="font-medium text-slate-800 px-4 pt-4">
          Sales per restaurant
        </h2>
        <table className="w-full text-sm mt-3">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-2 font-medium">Restaurant</th>
              <th className="px-4 py-2 font-medium">Delivered</th>
              <th className="px-4 py-2 font-medium">Sales</th>
              <th className="px-4 py-2 font-medium">Commission</th>
              <th className="px-4 py-2 font-medium">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {restaurants.data?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No restaurants yet.
                </td>
              </tr>
            )}
            {restaurants.data?.map((restaurant) => (
              <tr key={restaurant.restaurantId}>
                <td className="px-4 py-2 text-slate-800">{restaurant.name}</td>
                <td className="px-4 py-2 text-slate-700">
                  {restaurant.deliveredOrders}
                </td>
                <td className="px-4 py-2 text-slate-700">
                  {money(restaurant.sales)}
                </td>
                <td className="px-4 py-2 text-slate-700">
                  {money(restaurant.commission)}
                </td>
                <td className="px-4 py-2 text-slate-700">
                  {money(restaurant.net)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TopDishes dishes={topDishes.data ?? []} showRestaurant />
        {stats && <StatusBreakdown counts={stats.ordersByStatus} />}
      </div>
    </div>
  );
}