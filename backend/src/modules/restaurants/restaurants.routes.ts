import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import * as controller from "./restaurants.controller";

const router = Router();

// Public (clients)
router.get("/", controller.listPublic);

// Manager (must be declared before "/:id")
router.get("/me/info", authenticate, authorize("RESTAURANT"), controller.getMine);
router.patch("/me/info", authenticate, authorize("RESTAURANT"), controller.updateMine);

// Super admin
router.get("/admin/all", authenticate, authorize("SUPER_ADMIN"), controller.listAll);
router.post("/", authenticate, authorize("SUPER_ADMIN"), controller.create);
router.patch("/:id/status", authenticate, authorize("SUPER_ADMIN"), controller.changeStatus);

// Public: restaurant with its menu
router.get("/:id", controller.getOne);

export default router;