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
exports.changeStatus = exports.updateMine = exports.getMine = exports.getOne = exports.listAll = exports.listPublic = exports.create = void 0;
const service = __importStar(require("./restaurants.service"));
const restaurants_schema_1 = require("./restaurants.schema");
const create = async (req, res, next) => {
    try {
        const data = restaurants_schema_1.createRestaurantSchema.parse(req.body);
        res.status(201).json(await service.createRestaurant(data));
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const listPublic = async (_req, res, next) => {
    try {
        res.json(await service.listActiveRestaurants());
    }
    catch (err) {
        next(err);
    }
};
exports.listPublic = listPublic;
const listAll = async (_req, res, next) => {
    try {
        res.json(await service.listAllRestaurants());
    }
    catch (err) {
        next(err);
    }
};
exports.listAll = listAll;
const getOne = async (req, res, next) => {
    try {
        res.json(await service.getRestaurantWithMenu(Number(req.params.id)));
    }
    catch (err) {
        next(err);
    }
};
exports.getOne = getOne;
const getMine = async (req, res, next) => {
    try {
        res.json(await service.getMyRestaurant(req.user.id));
    }
    catch (err) {
        next(err);
    }
};
exports.getMine = getMine;
const updateMine = async (req, res, next) => {
    try {
        const data = restaurants_schema_1.updateRestaurantSchema.parse(req.body);
        res.json(await service.updateMyRestaurant(req.user.id, data));
    }
    catch (err) {
        next(err);
    }
};
exports.updateMine = updateMine;
const changeStatus = async (req, res, next) => {
    try {
        const { status } = restaurants_schema_1.statusSchema.parse(req.body);
        res.json(await service.setStatus(Number(req.params.id), status));
    }
    catch (err) {
        next(err);
    }
};
exports.changeStatus = changeStatus;
