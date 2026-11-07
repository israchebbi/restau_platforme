import { z } from "zod";
import { handle } from "../../utils/handle";
import * as service from "./stats.service";

const daysSchema = z.coerce.number().int().min(1).max(90).default(7);
const limitSchema = z.coerce.number().int().min(1).max(20).default(5);

// Super admin
export const adminOverview = handle(async () => ({
  ...(await service.getOverview()),
  ...(await service.getPlatformCounts()),
}));
export const adminDaily = handle((req) =>
  service.getDaily({}, daysSchema.parse(req.query.days))
);
export const adminRestaurants = handle(() => service.getRestaurantsStats());
export const adminTopDishes = handle((req) =>
  service.getTopDishes({}, limitSchema.parse(req.query.limit))
);

// Restaurant manager
export const restaurantOverview = handle(async (req) => {
  const restaurantId = await service.getRestaurantIdOfOwner(req.user!.id);
  return service.getOverview({ restaurantId });
});
export const restaurantDaily = handle(async (req) => {
  const restaurantId = await service.getRestaurantIdOfOwner(req.user!.id);
  return service.getDaily({ restaurantId }, daysSchema.parse(req.query.days));
});
export const restaurantTopDishes = handle(async (req) => {
  const restaurantId = await service.getRestaurantIdOfOwner(req.user!.id);
  return service.getTopDishes({ restaurantId }, limitSchema.parse(req.query.limit));
});