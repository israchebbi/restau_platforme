"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const error_1 = require("./middlewares/error");
const restaurants_routes_1 = __importDefault(require("./modules/restaurants/restaurants.routes"));
const menu_routes_1 = __importDefault(require("./modules/menu/menu.routes"));
const drivers_routes_1 = __importDefault(require("./modules/drivers/drivers.routes"));
const orders_routes_1 = __importDefault(require("./modules/orders/orders.routes"));
const stats_routes_1 = __importDefault(require("./modules/stats/stats.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const onboarding_routes_1 = __importDefault(require("./modules/onboarding/onboarding.routes"));
const uploads_routes_1 = __importDefault(require("./modules/uploads/uploads.routes"));
const cors_2 = require("./config/cors");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.set("trust proxy", 1); // the app runs behind a proxy in production
app.use((0, cors_1.default)({ origin: cors_2.allowedOrigins?.length ? cors_2.allowedOrigins : true }));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({ message: "Restaurant Platform API" });
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/restaurants", restaurants_routes_1.default);
app.use("/api/menu", menu_routes_1.default);
app.use("/api/drivers", drivers_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
app.use("/api/stats", stats_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/onboarding", onboarding_routes_1.default);
app.use("/api/uploads", uploads_routes_1.default);
app.use(error_1.errorHandler);
exports.default = app;
