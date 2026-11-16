import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError";
import { MulterError } from "multer";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image too large (5 MB maximum)"
        : err.message;
    res.status(400).json({ message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation error", errors: err.issues });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};