import { RequestHandler } from "express";
import * as service from "./menu.service";
import { categorySchema, dishSchema, dishUpdateSchema } from "./menu.schema";

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const { name } = categorySchema.parse(req.body);
    res.status(201).json(await service.createCategory(req.user!.id, name));
  } catch (err) {
    next(err);
  }
};

export const listCategories: RequestHandler = async (req, res, next) => {
  try {
    res.json(await service.listMyCategories(req.user!.id));
  } catch (err) {
    next(err);
  }
};

export const removeCategory: RequestHandler = async (req, res, next) => {
  try {
    await service.deleteCategory(req.user!.id, Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const createDish: RequestHandler = async (req, res, next) => {
  try {
    const data = dishSchema.parse(req.body);
    res.status(201).json(await service.createDish(req.user!.id, data));
  } catch (err) {
    next(err);
  }
};

export const updateDish: RequestHandler = async (req, res, next) => {
  try {
    const data = dishUpdateSchema.parse(req.body);
    res.json(await service.updateDish(req.user!.id, Number(req.params.id), data));
  } catch (err) {
    next(err);
  }
};

export const removeDish: RequestHandler = async (req, res, next) => {
  try {
    await service.deleteDish(req.user!.id, Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};