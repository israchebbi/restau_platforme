import { RequestHandler } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import * as authService from "./auth.service";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.registerClient(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user!.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};