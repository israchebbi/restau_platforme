import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as controller from "./onboarding.controller";

const router = Router();

// Public routes: limit the number of attempts per IP
router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later" },
  })
);

router.post("/restaurant", controller.applyRestaurant);
router.post("/driver", controller.applyDriver);

export default router;