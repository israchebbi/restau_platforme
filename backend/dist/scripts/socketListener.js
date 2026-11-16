"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const token = process.argv[2];
if (!token) {
    console.error("Usage: npm run listen -- <token>");
    process.exit(1);
}
const socket = (0, socket_io_client_1.io)("http://localhost:4000", { auth: { token } });
socket.on("connect", () => console.log("connected:", socket.id));
socket.on("connect_error", (err) => console.error("connection error:", err.message));
socket.onAny((event, data) => console.log("event:", event, JSON.stringify(data)));
