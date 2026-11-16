import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu as MenuIcon, X } from "lucide-react";
import { useAuth } from "../auth/auth-context";

const restaurantLinks = [
  { to: "/restaurant/orders", label: "Orders" },
  { to: "/restaurant/menu", label: "Menu" },
  { to: "/restaurant/stats", label: "Statistics" },
  { to: "/restaurant/profile", label: "Profile" },
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
  const [open, setOpen] = useState(false);
  const links = user?.role === "SUPER_ADMIN" ? adminLinks : restaurantLinks;

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-white border-r border-slate-200 transform transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold text-orange-600">
              Restaurant Platform
            </div>
            <div className="text-xs text-slate-500">
              {user?.role === "SUPER_ADMIN" ? "Administration" : "Restaurant"}
            </div>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="lg:hidden text-slate-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
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

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 bg-white border-b border-slate-200 px-4 py-3">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="text-slate-700"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <span className="font-semibold text-orange-600">
            Restaurant Platform
          </span>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}