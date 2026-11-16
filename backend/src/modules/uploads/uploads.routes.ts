import { Router } from "express";
import multer from "multer";
import { authenticate, authorize } from "../../middlewares/auth";
import { HttpError } from "../../utils/httpError";
import * as controller from "./uploads.controller";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new HttpError(400, "Only JPG, PNG or WebP images are allowed"));
  },
});

const router = Router();

// Authentication runs before the file is read
router.post(
  "/image",
  authenticate,
  authorize("RESTAURANT", "SUPER_ADMIN"),
  upload.single("image"),
  controller.uploadImage
);

export default router;