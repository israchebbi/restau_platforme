"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestaurant = createRestaurant;
exports.listActiveRestaurants = listActiveRestaurants;
exports.listAllRestaurants = listAllRestaurants;
exports.getRestaurantWithMenu = getRestaurantWithMenu;
exports.getMyRestaurant = getMyRestaurant;
exports.updateMyRestaurant = updateMyRestaurant;
exports.setStatus = setStatus;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
async function createRestaurant(data) {
    const existing = await prisma_1.prisma.user.findUnique({
        where: { email: data.manager.email },
    });
    if (existing)
        throw new httpError_1.HttpError(409, "Manager email already used");
    const passwordHash = await bcryptjs_1.default.hash(data.manager.password, 10);
    const { manager, ...restaurantData } = data;
    return prisma_1.prisma.restaurant.create({
        data: {
            ...restaurantData,
            status: "ACTIVE",
            owner: {
                create: {
                    name: manager.name,
                    email: manager.email,
                    phone: manager.phone,
                    passwordHash,
                    role: "RESTAURANT",
                },
            },
        },
        include: { owner: { select: { id: true, name: true, email: true } } },
    });
}
function listActiveRestaurants() {
    return prisma_1.prisma.restaurant.findMany({
        where: { status: "ACTIVE" },
        select: {
            id: true,
            name: true,
            logo: true,
            address: true,
            latitude: true,
            longitude: true,
            cuisine: true,
            openingHours: true,
        },
    });
}
function listAllRestaurants() {
    return prisma_1.prisma.restaurant.findMany({
        include: { owner: { select: { id: true, name: true, email: true } } },
    });
}
async function getRestaurantWithMenu(id) {
    const restaurant = await prisma_1.prisma.restaurant.findFirst({
        where: { id, status: "ACTIVE" },
        include: {
            categories: {
                include: { dishes: { where: { available: true } } },
            },
        },
    });
    if (!restaurant)
        throw new httpError_1.HttpError(404, "Restaurant not found");
    return restaurant;
}
async function getMyRestaurant(userId) {
    const restaurant = await prisma_1.prisma.restaurant.findUnique({
        where: { ownerId: userId },
    });
    if (!restaurant)
        throw new httpError_1.HttpError(404, "No restaurant for this account");
    return restaurant;
}
async function updateMyRestaurant(userId, data) {
    const restaurant = await getMyRestaurant(userId);
    return prisma_1.prisma.restaurant.update({ where: { id: restaurant.id }, data });
}
async function setStatus(id, status) {
    const restaurant = await prisma_1.prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant)
        throw new httpError_1.HttpError(404, "Restaurant not found");
    return prisma_1.prisma.restaurant.update({ where: { id }, data: { status } });
}
