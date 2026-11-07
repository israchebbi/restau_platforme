import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import * as controller from "./orders.controller";

const router = Router();

router.use(authenticate);

// Client
router.post("/", authorize("CLIENT"), controller.create);
router.get("/my", authorize("CLIENT"), controller.listMine);
router.patch("/:id/cancel", authorize("CLIENT"), controller.cancel);

// Restaurant
router.get("/restaurant", authorize("RESTAURANT"), controller.listForRestaurant);
router.patch("/:id/status", authorize("RESTAURANT"), controller.changeStatus);

// Driver
router.get("/available", authorize("DRIVER"), controller.listAvailable);
router.get("/driver/mine", authorize("DRIVER"), controller.listForDriver);
router.post("/:id/accept", authorize("DRIVER"), controller.accept);
router.patch("/:id/delivery-status", authorize("DRIVER"), controller.changeDeliveryStatus);

// Any user involved in the order (checked in the service)
router.get("/:id", controller.getOne);

export default router;