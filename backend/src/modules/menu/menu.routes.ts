import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import * as controller from "./menu.controller";

const router = Router();

router.use(authenticate, authorize("RESTAURANT"));

router.get("/categories", controller.listCategories);
router.post("/categories", controller.createCategory);
router.delete("/categories/:id", controller.removeCategory);

router.post("/dishes", controller.createDish);
router.patch("/dishes/:id", controller.updateDish);
router.delete("/dishes/:id", controller.removeDish);

export default router;