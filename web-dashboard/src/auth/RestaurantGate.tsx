import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Ban, Clock } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "./auth-context";
import type { MyRestaurant } from "../types";

export default function RestaurantGate() {
  const { logout } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["my-restaurant"],
    queryFn: async () =>
      (await api.get<MyRestaurant>("/api/restaurants/me/info")).data,
    // While the restaurant is not active, check again every 30 seconds
    refetchInterval: (query) =>
      query.state.data?.status === "ACTIVE" ? false : 30000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (data && data.status !== "ACTIVE") {
    const pending = data.status === "PENDING";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white p-6">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <span
            className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center ${
              pending ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
            }`}
          >
            {pending ? <Clock className="h-7 w-7" /> : <Ban className="h-7 w-7" />}
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-slate-900">
            {pending ? "Your application is being reviewed" : "Your restaurant is suspended"}
          </h1>
          <p className="mt-2 text-slate-600">
            {pending
              ? `${data.name} will be live as soon as our team approves it. This page updates by itself.`
              : `${data.name} is currently suspended. Please contact the platform administrators.`}
          </p>
          <button
            onClick={logout}
            className="mt-8 w-full rounded-xl border border-slate-300 text-sm py-2.5 text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}