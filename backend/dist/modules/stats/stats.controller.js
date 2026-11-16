"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantTopDishes = exports.restaurantDaily = exports.restaurantOverview = exports.adminTopDishes = exports.adminRestaurants = exports.adminDaily = exports.adminOverview = void 0;
const zod_1 = require("zod");
const handle_1 = require("../../utils/handle");
const service = __importStar(require("./stats.service"));
const daysSchema = zod_1.z.coerce.number().int().min(1).max(90).default(7);
const limitSchema = zod_1.z.coerce.number().int().min(1).max(20).default(5);
// Super admin
exports.adminOverview = (0, handle_1.handle)(async () => ({
    ...(await service.getOverview()),
    ...(await service.getPlatformCounts()),
}));
exports.adminDaily = (0, handle_1.handle)((req) => service.getDaily({}, daysSchema.parse(req.query.days)));
exports.adminRestaurants = (0, handle_1.handle)(() => service.getRestaurantsStats());
exports.adminTopDishes = (0, handle_1.handle)((req) => service.getTopDishes({}, limitSchema.parse(req.query.limit)));
// Restaurant manager
exports.restaurantOverview = (0, handle_1.handle)(async (req) => {
    const restaurantId = await service.getRestaurantIdOfOwner(req.user.id);
    return service.getOverview({ restaurantId });
});
exports.restaurantDaily = (0, handle_1.handle)(async (req) => {
    const restaurantId = await service.getRestaurantIdOfOwner(req.user.id);
    return service.getDaily({ restaurantId }, daysSchema.parse(req.query.days));
});
exports.restaurantTopDishes = (0, handle_1.handle)(async (req) => {
    const restaurantId = await service.getRestaurantIdOfOwner(req.user.id);
    return service.getTopDishes({ restaurantId }, limitSchema.parse(req.query.limit));
});
