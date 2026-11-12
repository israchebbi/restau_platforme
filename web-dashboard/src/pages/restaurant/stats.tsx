import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, getErrorMessage } from "../../lib/api";
import StatCard from "../../components/stats/StatCard";
import DailyCharts from "../../components/stats/DailyCharts";
import TopDishes from "../../components/stats/TopDishes";
import StatusBreakdown from "../../components/stats/StatusBreakdown";
import type { DailyStat, StatsOverview, TopDish } from "../../types";

const money = (n: number) => `${n.toFixed(2)} DT`;
const RANGES = [7, 14, 30];

export default function Stats() {
  const [days, setDays] = useState(7);

  const overview = useQuery({
    queryKey: ["stats", "restaurant", "overview"],
    queryFn: async () =>
      (await api.get<StatsOverview>("/api/stats/restaurant/overview")).data,
  });

  const daily = useQuery({
    queryKey: ["stats", "restaurant", "daily", days],
    queryFn: async () =>
      (await api.get<DailyStat[]>(`/api/stats/restaurant/daily?days=${days}`))
        .data,
  });

  const topDishes = useQuery({
    queryKey: ["stats", "restaurant", "top-dishes"],
    queryFn: async () =>
      (await api.get<TopDish[]>("/api/stats/restaurant/top-dishes?limit=5"))
        .data,
  });

  const error = overview.error ?? daily.error ?? topDishes.error;
  const stats = overview.data;

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Statistics</h1>

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
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard
            label="Sales"
            value={money(stats.sales)}
            hint="Delivered orders, delivery fees excluded"
          />
          <StatCard
            label="Net revenue"
            value={money(stats.restaurantNet)}
            hint="After the platform commission"
          />
          <StatCard
            label="Platform commission"
            value={money(stats.platformCommission)}
          />
          <StatCard
            label="Delivered orders"
            value={String(stats.deliveredOrders)}
          />
          <StatCard
            label="Average order"
            value={money(stats.averageOrderValue)}
            hint="Delivery fee included"
          />
          <StatCard label="Total orders" value={String(stats.totalOrders)} />
        </div>
      )}

      {daily.data && <DailyCharts data={daily.data} />}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TopDishes dishes={topDishes.data ?? []} />
        {stats && <StatusBreakdown counts={stats.ordersByStatus} />}
      </div>
    </div>
  );
}