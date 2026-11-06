import { RequestHandler } from "express";
import * as service from "./restaurants.service";
import {
  createRestaurantSchema,
  statusSchema,
  updateRestaurantSchema,
} from "./restaurants.schema";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = createRestaurantSchema.parse(req.body);
    res.status(201).json(await service.createRestaurant(data));
  } catch (err) {
    next(err);
  }
};

export const listPublic: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await service.listActiveRestaurants());
  } catch (err) {
    next(err);
  }
};

export const listAll: RequestHandler = async (_req, res, next) => {
  try {
    res.json(await service.listAllRestaurants());
  } catch (err) {
    next(err);
  }
};

export const getOne: RequestHandler = async (req, res, next) => {
  try {
    res.json(await service.getRestaurantWithMenu(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
};

export const getMine: RequestHandler = async (req, res, next) => {
  try {
    res.json(await service.getMyRestaurant(req.user!.id));
  } catch (err) {
    next(err);
  }
};

export const updateMine: RequestHandler = async (req, res, next) => {
  try {
    const data = updateRestaurantSchema.parse(req.body);
    res.json(await service.updateMyRestaurant(req.user!.id, data));
  } catch (err) {
    next(err);
  }
};

export const changeStatus: RequestHandler = async (req, res, next) => {
  try {
    const { status } = statusSchema.parse(req.body);
    res.json(await service.setStatus(Number(req.params.id), status));
  } catch (err) {
    next(err);
  }
};