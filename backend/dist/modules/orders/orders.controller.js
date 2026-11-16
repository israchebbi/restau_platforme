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
exports.getOne = exports.listForDriver = exports.changeDeliveryStatus = exports.accept = exports.listAvailable = exports.changeStatus = exports.listForRestaurant = exports.cancel = exports.listMine = exports.create = void 0;
const httpError_1 = require("../../utils/httpError");
const service = __importStar(require("./orders.service"));
const orders_schema_1 = require("./orders.schema");
// Small helper: runs a handler, sends its result as JSON, forwards errors
const handle = (fn, status = 200) => async (req, res, next) => {
    try {
        res.status(status).json(await fn(req));
    }
    catch (err) {
        next(err);
    }
};
const idParam = (req) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
        throw new httpError_1.HttpError(400, "Invalid id");
    return id;
};
// Client
exports.create = handle((req) => service.createOrder(req.user.id, orders_schema_1.createOrderSchema.parse(req.body)), 201);
exports.listMine = handle((req) => service.listMyOrders(req.user.id));
exports.cancel = handle((req) => service.cancelOrder(req.user.id, idParam(req)));
// Restaurant
exports.listForRestaurant = handle((req) => service.listRestaurantOrders(req.user.id, req.query.status));
exports.changeStatus = handle((req) => service.updateRestaurantStatus(req.user.id, idParam(req), orders_schema_1.restaurantStatusSchema.parse(req.body).status));
// Driver
exports.listAvailable = handle((req) => service.listAvailableOrders(req.user.id));
exports.accept = handle((req) => service.acceptOrder(req.user.id, idParam(req)));
exports.changeDeliveryStatus = handle((req) => service.updateDeliveryStatus(req.user.id, idParam(req), orders_schema_1.deliveryStatusSchema.parse(req.body).status));
exports.listForDriver = handle((req) => service.listDriverOrders(req.user.id));
// Shared
exports.getOne = handle((req) => service.getOrder(req.user, idParam(req)));
