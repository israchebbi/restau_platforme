import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "../../lib/api";
import RestaurantForm from "../../components/RestaurantForm";
import type { RestaurantFormValues } from "../../components/RestaurantForm";
import type { AdminRestaurant, RestaurantStatus } from "../../types";

const BADGES: Record<RestaurantStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-green-50 text-green-700" },
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700" },
  SUSPENDED: { label: "Suspended", className: "bg-red-50 text-red-700" },
};

const FILTERS: { label: string; value: RestaurantStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Suspended", value: "SUSPENDED" },
];

export default function Restaurants() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<RestaurantStatus | "ALL">("ALL");
  const [error, setError] = useState("");

  const {
    data: restaurants = [],
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["admin-restaurants"],
    queryFn: async () =>
      (await api.get<AdminRestaurant[]>("/api/restaurants/admin/all")).data,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });

  const createRestaurant = useMutation({
    mutationFn: (values: RestaurantFormValues) =>
      api.post("/api/restaurants", values),
    onSuccess: () => {
      setShowForm(false);
      setError("");
      refresh();
    },
    onError: (e) => setError(getErrorMessage(e)),
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: RestaurantStatus }) =>
      api.patch(`/api/restaurants/${id}/status`, { status }),
    onSuccess: () => {
      setError("");
      refresh();
    },
    onError: (e) => setError(getErrorMessage(e)),
  });

  const visible =
    filter === "ALL"
      ? restaurants
      : restaurants.filter((r) => r.status === filter);

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Restaurants</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2"
        >
          Add restaurant
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {showForm && (
        <RestaurantForm
          submitting={createRestaurant.isPending}
          onSubmit={(values) => createRestaurant.mutate(values)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`text-sm px-3 py-1 rounded-md ${
              filter === item.value
                ? "bg-orange-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-slate-500">Loading restaurants…</p>}
      {loadError && (
        <p className="text-red-600 text-sm">{getErrorMessage(loadError)}</p>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3 font-medium">Restaurant</th>
              <th className="px-4 py-3 font-medium">Manager</th>
              <th className="px-4 py-3 font-medium">Commission</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!isLoading && visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No restaurants found.
                </td>
              </tr>
            )}

            {visible.map((restaurant) => {
              const badge = BADGES[restaurant.status];
              return (
                <tr key={restaurant.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">
                      {restaurant.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {restaurant.cuisine} · {restaurant.address}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-800">{restaurant.owner.name}</div>
                    <div className="text-xs text-slate-500">
                      {restaurant.owner.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {Math.round(restaurant.commissionRate * 1000) / 10}%
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {restaurant.status === "ACTIVE" ? (
                      <button
                        disabled={changeStatus.isPending}
                        onClick={() => {
                          if (
                            window.confirm(`Suspend "${restaurant.name}"?`)
                          ) {
                            changeStatus.mutate({
                              id: restaurant.id,
                              status: "SUSPENDED",
                            });
                          }
                        }}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        disabled={changeStatus.isPending}
                        onClick={() =>
                          changeStatus.mutate({
                            id: restaurant.id,
                            status: "ACTIVE",
                          })
                        }
                        className="text-green-700 hover:underline disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}