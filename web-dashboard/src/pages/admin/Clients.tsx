import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "../../lib/api";
import type { ClientRow } from "../../types";

export default function Clients() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const {
    data: clients = [],
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () =>
      (await api.get<ClientRow[]>("/api/admin/clients")).data,
  });

  const blockClient = useMutation({
    mutationFn: ({ id, blocked }: { id: number; blocked: boolean }) =>
      api.patch(`/api/admin/users/${id}/block`, { blocked }),
    onSuccess: () => {
      setError("");
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
    onError: (e) => setError(getErrorMessage(e)),
  });

  const term = search.trim().toLowerCase();
  const visible = clients.filter(
    (c) =>
      term === "" ||
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
  );

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-800">
          Clients{" "}
          <span className="text-base font-normal text-slate-400">
            ({clients.length})
          </span>
        </h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {isLoading && <p className="text-slate-500">Loading clients…</p>}
      {loadError && (
        <p className="text-red-600 text-sm">{getErrorMessage(loadError)}</p>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!isLoading && visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No clients found.
                </td>
              </tr>
            )}

            {visible.map((client) => (
              <tr key={client.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{client.name}</div>
                  <div className="text-xs text-slate-500">{client.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-700">{client.phone}</td>
                <td className="px-4 py-3 text-slate-700">
                  {client._count.orders}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      client.isBlocked
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {client.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    disabled={blockClient.isPending}
                    onClick={() => {
                      const blocking = !client.isBlocked;
                      if (
                        !blocking ||
                        window.confirm(`Block "${client.name}"?`)
                      ) {
                        blockClient.mutate({
                          id: client.id,
                          blocked: blocking,
                        });
                      }
                    }}
                    className={`hover:underline disabled:opacity-50 ${
                      client.isBlocked ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {client.isBlocked ? "Unblock" : "Block"}
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