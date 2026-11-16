"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParam = exports.handle = void 0;
const httpError_1 = require("./httpError");
const handle = (fn, status = 200) => async (req, res, next) => {
    try {
        res.status(status).json(await fn(req));
    }
    catch (err) {
        next(err);
    }
};
exports.handle = handle;
const idParam = (req) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
        throw new httpError_1.HttpError(400, "Invalid id");
    return id;
};
exports.idParam = idParam;
