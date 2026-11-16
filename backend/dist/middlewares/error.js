"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const httpError_1 = require("../utils/httpError");
const multer_1 = require("multer");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof multer_1.MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? "Image too large (5 MB maximum)"
            : err.message;
        res.status(400).json({ message });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({ message: "Validation error", errors: err.issues });
        return;
    }
    if (err instanceof httpError_1.HttpError) {
        res.status(err.status).json({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
};
exports.errorHandler = errorHandler;
