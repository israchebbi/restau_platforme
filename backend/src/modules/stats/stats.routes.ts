import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import * as controller from "./stats.controller";

const router = Router();

router.use(authenticate);

router.get("/admin/overview", authorize("SUPER_ADMIN"), controller.adminOverview);
router.get("/admin/daily", authorize("SUPER_ADMIN"), controller.adminDaily);
router.get("/admin/restaurants", authorize("SUPER_ADMIN"), controller.adminRestaurants);
router.get("/admin/top-dishes", authorize("SUPER_ADMIN"), controller.adminTopDishes);

router.get("/restaurant/overview", authorize("RESTAURANT"), controller.restaurantOverview);
router.get("/restaurant/daily", authorize("RESTAURANT"), controller.restaurantDaily);
router.get("/restaurant/top-dishes", authorize("RESTAURANT"), controller.restaurantTopDishes);

export default router;