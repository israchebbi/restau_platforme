import { RequestHandler } from "express";
import * as service from "./drivers.service";
import {
  availabilitySchema,
  createDriverSchema,
  locationSchema,
} from "./drivers.schema";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = createDriverSchema.parse(req.body);
    res.status(201).json(await service.createDriver(data));
  } catch (err) {
    next(err);
  }
};

export const list: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await service.listDrivers());
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    await service.deleteDriver(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    res.json(await service.getMyDriver(req.user!.id));
  } catch (err) {
    next(err);
  }
};

export const updateAvailability: RequestHandler = async (req, res, next) => {
  try {
    const { available } = availabilitySchema.parse(req.body);
    res.json(await service.setAvailability(req.user!.id, available));
  } catch (err) {
    next(err);
  }
};

export const updateLocation: RequestHandler = async (req, res, next) => {
  try {
    const { latitude, longitude } = locationSchema.parse(req.body);
    res.json(await service.setLocation(req.user!.id, latitude, longitude));
  } catch (err) {
    next(err);
  }
};