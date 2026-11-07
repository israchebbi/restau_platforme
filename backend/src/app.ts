import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/error";
import restaurantsRoutes from "./modules/restaurants/restaurants.routes";
import menuRoutes from "./modules/menu/menu.routes";
import driverRoutes from "./modules/drivers/drivers.routes";
import orderRoutes from "./modules/orders/orders.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Restaurant Platform API" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/menu" , menuRoutes);
app.use("/api/drivers" , driverRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

export default app;