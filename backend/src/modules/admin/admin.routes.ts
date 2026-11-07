import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import * as controller from "./admin.controller";

const router = Router();

router.use(authenticate, authorize("SUPER_ADMIN"));

router.get("/clients", controller.clients);
router.get("/orders", controller.orders);
router.patch("/users/:id/block", controller.block);

export default router;