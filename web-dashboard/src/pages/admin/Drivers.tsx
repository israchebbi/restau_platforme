import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "../../lib/api";
import DriverForm from "../../components/DriverForm";
import type { DriverFormValues } from "../../components/DriverForm";
import type { DriverRow } from "../../types";

export default function Drivers() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const {
    data: drivers = [],
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["admin-drivers"],
    queryFn: async () => (await api.get<DriverRow[]>("/api/drivers")).data,
    refetchInterval: 15000, // keeps the availability fresh
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-drivers"] });
  const onError = (e: unknown) => setError(getErrorMessage(e));

  const createDriver = useMutation({
    mutationFn: (values: DriverFormValues) => api.post("/api/drivers", values),
    onSuccess: () => {
      setShowForm(false);
      setError("");
      refresh();
    },
    onError,
  });

  const removeDriver = useMutation({
    mutationFn: (id: number) => api.delete(`/api/drivers/${id}`),
    onSuccess: () => {
      setError("");
      refresh();
    },
    onError,
  });

  const blockDriver = useMutation({
    mutationFn: ({ userId, blocked }: { userId: number; blocked: boolean }) =>
      api.patch(`/api/admin/users/${userId}/block`, { blocked }),
    onSuccess: () => {
      setError("");
      refresh();
    },
    onError,
  });

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Drivers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2"
        >
          Add driver
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {showForm && (
        <DriverForm
          submitting={createDriver.isPending}
          onSubmit={(values) => createDriver.mutate(values)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {isLoading && <p className="text-slate-500">Loading drivers…</p>}
      {loadError && (
        <p className="text-red-600 text-sm">{getErrorMessage(loadError)}</p>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3 font-medium">Driver</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Availability</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!isLoading && drivers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No drivers yet.
                </td>
              </tr>
            )}

            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">
                    {driver.user.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {driver.user.email}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{driver.user.phone}</td>
                <td className="px-4 py-3 text-slate-700">
                  {driver.vehicle ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      driver.available
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {driver.available ? "Available" : "Offline"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      driver.user.isBlocked
                        ? "bg-red-50 text-red-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {driver.user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    disabled={blockDriver.isPending}
                    onClick={() =>
                      blockDriver.mutate({
                        userId: driver.userId,
                        blocked: !driver.user.isBlocked,
                      })
                    }
                    className="text-slate-600 hover:underline mr-4 disabled:opacity-50"
                  >
                    {driver.user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    disabled={removeDriver.isPending}
                    onClick={() => {
                      if (window.confirm(`Delete "${driver.user.name}"?`)) {
                        removeDriver.mutate(driver.id);
                      }
                    }}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}