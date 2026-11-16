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
exports.changeStatus = exports.updateLocation = exports.updateAvailability = exports.me = exports.remove = exports.list = exports.create = void 0;
const service = __importStar(require("./drivers.service"));
const drivers_schema_1 = require("./drivers.schema");
const create = async (req, res, next) => {
    try {
        const data = drivers_schema_1.createDriverSchema.parse(req.body);
        res.status(201).json(await service.createDriver(data));
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const list = async (_req, res, next) => {
    try {
        res.json(await service.listDrivers());
    }
    catch (err) {
        next(err);
    }
};
exports.list = list;
const remove = async (req, res, next) => {
    try {
        await service.deleteDriver(Number(req.params.id));
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
const me = async (req, res, next) => {
    try {
        res.json(await service.getMyDriver(req.user.id));
    }
    catch (err) {
        next(err);
    }
};
exports.me = me;
const updateAvailability = async (req, res, next) => {
    try {
        const { available } = drivers_schema_1.availabilitySchema.parse(req.body);
        res.json(await service.setAvailability(req.user.id, available));
    }
    catch (err) {
        next(err);
    }
};
exports.updateAvailability = updateAvailability;
const updateLocation = async (req, res, next) => {
    try {
        const { latitude, longitude } = drivers_schema_1.locationSchema.parse(req.body);
        res.json(await service.setLocation(req.user.id, latitude, longitude));
    }
    catch (err) {
        next(err);
    }
};
exports.updateLocation = updateLocation;
const changeStatus = async (req, res, next) => {
    try {
        const { status } = drivers_schema_1.driverStatusSchema.parse(req.body);
        res.json(await service.setDriverStatus(Number(req.params.id), status));
    }
    catch (err) {
        next(err);
    }
};
exports.changeStatus = changeStatus;
