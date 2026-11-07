import { handle, idParam } from "../../utils/handle";
import * as service from "./admin.service";
import { blockSchema, ordersQuerySchema } from "./admin.schema";

export const clients = handle(() => service.listClients());

export const orders = handle((req) =>
  service.listOrders(ordersQuerySchema.parse(req.query))
);

export const block = handle((req) =>
  service.setBlocked(idParam(req), blockSchema.parse(req.body).blocked)
);