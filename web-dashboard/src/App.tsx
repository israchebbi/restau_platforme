import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/auth-context";
import { homeFor } from "./auth/home";
import ProtectedRoute from "./auth/protectionRoute";
import DashboardLayout from "./layouts/dashboardLayout";
import Login from "./pages/login";
import Placeholder from "./pages/placeholder";
import Orders from "./pages/restaurant/orders";
import Menu from "./pages/restaurant/menu";
import stats from "./pages/restaurant/stats";
import Stats from "./pages/restaurant/stats";

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
          <Route path="/admin/overview" element={<Placeholder title="Overview" />} />
          <Route path="/admin/restaurants" element={<Placeholder title="Restaurants" />} />
          <Route path="/admin/drivers" element={<Placeholder title="Drivers" />} />
          <Route path="/admin/clients" element={<Placeholder title="Clients" />} />
          <Route path="/admin/orders" element={<Placeholder title="All orders" />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={user ? homeFor(user.role) : "/login"} replace />}
      />
    </Routes>
  );
}