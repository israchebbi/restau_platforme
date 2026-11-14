import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/auth-context";
import { homeFor } from "./auth/home";
import ProtectedRoute from "./auth/protectionRoute";
import DashboardLayout from "./layouts/dashboardLayout";
import Login from "./pages/login";
import Placeholder from "./pages/placeholder";
import Orders from "./pages/restaurant/orders";
import Menu from "./pages/restaurant/menu";
import Stats from "./pages/restaurant/stats";
import Restaurants from "./pages/admin/Restaurants";
import Clients from "./pages/admin/Clients";
import Drivers from "./pages/admin/Drivers";
import Overview from "./pages/admin/Overview";
import AllOrders from "./pages/admin/AllOrders";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute roles={["RESTAURANT"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/restaurant/orders" element={<Orders />} />
          <Route path="/restaurant/menu" element={<Menu />} />
          <Route path="/restaurant/stats" element={<Stats />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["SUPER_ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/overview" element={<Overview />} />
          <Route path="/admin/restaurants" element={<Restaurants />} />
          <Route path="/admin/drivers" element={<Drivers />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/orders" element={<AllOrders />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={user ? homeFor(user.role) : "/login"} replace />}
      />
    </Routes>
  );
}