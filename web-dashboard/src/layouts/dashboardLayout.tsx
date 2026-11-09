import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

const restaurantLinks = [
  { to: "/restaurant/orders", label: "Orders" },
  { to: "/restaurant/menu", label: "Menu" },
  { to: "/restaurant/stats", label: "Statistics" },
];

const adminLinks = [
  { to: "/admin/overview", label: "Overview" },
  { to: "/admin/restaurants", label: "Restaurants" },
  { to: "/admin/drivers", label: "Drivers" },
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/orders", label: "Orders" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const links = user?.role === "SUPER_ADMIN" ? adminLinks : restaurantLinks;

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <div className="text-lg font-semibold text-orange-600">
            Restaurant Platform
          </div>
          <div className="text-xs text-slate-500">
            {user?.role === "SUPER_ADMIN" ? "Administration" : "Restaurant"}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-orange-50 text-orange-700 font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2">
          <div className="text-sm font-medium text-slate-800 truncate">
            {user?.name}
          </div>
          <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          <button
            onClick={logout}
            className="w-full rounded-lg border border-slate-300 text-sm py-1.5 text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6">
        <Outlet />
      </main>
    </div>
  );
}