import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import * as controller from "./auth.controller";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", authenticate, controller.me);

export default router;