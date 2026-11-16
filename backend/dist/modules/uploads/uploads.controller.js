"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const handle_1 = require("../../utils/handle");
const httpError_1 = require("../../utils/httpError");
const uploads_service_1 = require("./uploads.service");
exports.uploadImage = (0, handle_1.handle)(async (req) => {
    if (!req.file)
        throw new httpError_1.HttpError(400, "No image received");
    const folder = req.query.type === "logo" ? "logos" : "dishes";
    const url = await (0, uploads_service_1.uploadImage)(req.file.buffer, `restaurant-platform/${folder}`);
    return { url };
}, 201);
