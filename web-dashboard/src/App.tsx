import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/auth-context";
import { homeFor } from "./auth/home";
import ProtectedRoute from "./auth/protectionRoute";
import RestaurantGate from "./auth/RestaurantGate";
import DashboardLayout from "./layouts/dashboardLayout";
import Login from "./pages/login";
import Join from "./pages/join/Join";
import JoinRestaurant from "./pages/join/JoinRestaurant";
import JoinDriver from "./pages/join/JoinDriver";
import JoinDone from "./pages/join/JoinDone";
import Orders from "./pages/restaurant/orders";
import Menu from "./pages/restaurant/menu";
import Stats from "./pages/restaurant/stats";
import Profile from "./pages/restaurant/Profile";
import Overview from "./pages/admin/Overview";
import Restaurants from "./pages/admin/Restaurants";
import Drivers from "./pages/admin/Drivers";
import Clients from "./pages/admin/Clients";
import AllOrders from "./pages/admin/AllOrders";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/join" element={<Join />} />
      <Route path="/join/restaurant" element={<JoinRestaurant />} />
      <Route path="/join/driver" element={<JoinDriver />} />
      <Route path="/join/done/:type" element={<JoinDone />} />

      <Route element={<ProtectedRoute roles={["RESTAURANT"]} />}>
        <Route element={<RestaurantGate />}>
          <Route element={<DashboardLayout />}>
            <Route path="/restaurant/orders" element={<Orders />} />
            <Route path="/restaurant/menu" element={<Menu />} />
            <Route path="/restaurant/stats" element={<Stats />} />
            <Route path="/restaurant/profile" element={<Profile />} />
          </Route>
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