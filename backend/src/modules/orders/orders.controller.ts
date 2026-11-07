import { Request, RequestHandler } from "express";
import { OrderStatus } from "@prisma/client";
import { HttpError } from "../../utils/httpError";
import * as service from "./orders.service";
import {
  createOrderSchema,
  deliveryStatusSchema,
  restaurantStatusSchema,
} from "./orders.schema";

// Small helper: runs a handler, sends its result as JSON, forwards errors
const handle =
  (fn: (req: Request) => Promise<unknown>, status = 200): RequestHandler =>
  async (req, res, next) => {
    try {
      res.status(status).json(await fn(req));
    } catch (err) {
      next(err);
    }
  };

const idParam = (req: Request) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new HttpError(400, "Invalid id");
  return id;
};

// Client
export const create = handle(
  (req) => service.createOrder(req.user!.id, createOrderSchema.parse(req.body)),
  201
);
export const listMine = handle((req) => service.listMyOrders(req.user!.id));
export const cancel = handle((req) =>
  service.cancelOrder(req.user!.id, idParam(req))
);

// Restaurant
export const listForRestaurant = handle((req) =>
  service.listRestaurantOrders(
    req.user!.id,
    req.query.status as OrderStatus | undefined
  )
);
export const changeStatus = handle((req) =>
  service.updateRestaurantStatus(
    req.user!.id,
    idParam(req),
    restaurantStatusSchema.parse(req.body).status
  )
);

// Driver
export const listAvailable = handle(() => service.listAvailableOrders());
export const accept = handle((req) =>
  service.acceptOrder(req.user!.id, idParam(req))
);
export const changeDeliveryStatus = handle((req) =>
  service.updateDeliveryStatus(
    req.user!.id,
    idParam(req),
    deliveryStatusSchema.parse(req.body).status
  )
);
export const listForDriver = handle((req) =>
  service.listDriverOrders(req.user!.id)
);

// Shared
export const getOne = handle((req) =>
  service.getOrder(req.user!, idParam(req))
);