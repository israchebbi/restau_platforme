import { handle } from "../../utils/handle";
import { HttpError } from "../../utils/httpError";
import { uploadImage as upload } from "./uploads.service";

export const uploadImage = handle(async (req) => {
  if (!req.file) throw new HttpError(400, "No image received");

  const folder = req.query.type === "logo" ? "logos" : "dishes";
  const url = await upload(req.file.buffer, `restaurant-platform/${folder}`);
  return { url };
}, 201);