import { handle } from "../../utils/handle";
import * as service from "./onboarding.service";
import {
  driverApplicationSchema,
  restaurantApplicationSchema,
} from "./onboarding.schema";

export const applyRestaurant = handle(
  (req) =>
    service.applyRestaurant(restaurantApplicationSchema.parse(req.body)),
  201
);

export const applyDriver = handle(
  (req) => service.applyDriver(driverApplicationSchema.parse(req.body)),
  201
);