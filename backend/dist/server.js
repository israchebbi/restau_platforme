"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const sockets_1 = require("./sockets");
const PORT = process.env.PORT || 4000;
const server = http_1.default.createServer(app_1.default);
(0, sockets_1.initSocket)(server);
server.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
