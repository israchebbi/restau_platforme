import { Request, RequestHandler } from "express";
import { HttpError } from "./httpError";

export const handle =
  (fn: (req: Request) => Promise<unknown>, status = 200): RequestHandler =>
  async (req, res, next) => {
    try {
      res.status(status).json(await fn(req));
    } catch (err) {
      next(err);
    }
  };

export const idParam = (req: Request) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new HttpError(400, "Invalid id");
  return id;
};