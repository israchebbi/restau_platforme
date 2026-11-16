"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
function uploadImage(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({
            folder,
            resource_type: "image",
            // Keep files light: max 1200 px, automatic quality and format
            transformation: [
                {
                    width: 1200,
                    height: 1200,
                    crop: "limit",
                    quality: "auto",
                    fetch_format: "auto",
                },
            ],
        }, (error, result) => {
            if (error || !result) {
                reject(error ?? new Error("Upload failed"));
                return;
            }
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
}
