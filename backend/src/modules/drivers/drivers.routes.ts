import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import * as controller from "./drivers.controller";

const router = Router();

router.use(authenticate);

// Driver
router.get("/me", authorize("DRIVER"), controller.me);
router.patch("/me/availability", authorize("DRIVER"), controller.updateAvailability);
router.patch("/me/location", authorize("DRIVER"), controller.updateLocation);

// Super admin
router.get("/", authorize("SUPER_ADMIN"), controller.list);
router.post("/", authorize("SUPER_ADMIN"), controller.create);
router.delete("/:id", authorize("SUPER_ADMIN"), controller.remove);

export default router;