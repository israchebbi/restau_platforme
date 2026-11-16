"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.listMyCategories = listMyCategories;
exports.deleteCategory = deleteCategory;
exports.createDish = createDish;
exports.updateDish = updateDish;
exports.deleteDish = deleteDish;
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
async function getRestaurantId(userId) {
    const restaurant = await prisma_1.prisma.restaurant.findUnique({
        where: { ownerId: userId },
    });
    if (!restaurant)
        throw new httpError_1.HttpError(404, "No restaurant for this account");
    return restaurant.id;
}
// ---------- Categories ----------
async function createCategory(userId, name) {
    const restaurantId = await getRestaurantId(userId);
    return prisma_1.prisma.category.create({ data: { name, restaurantId } });
}
async function listMyCategories(userId) {
    const restaurantId = await getRestaurantId(userId);
    return prisma_1.prisma.category.findMany({
        where: { restaurantId },
        include: { dishes: true },
    });
}
async function deleteCategory(userId, id) {
    const restaurantId = await getRestaurantId(userId);
    const category = await prisma_1.prisma.category.findFirst({
        where: { id, restaurantId },
        include: { dishes: true },
    });
    if (!category)
        throw new httpError_1.HttpError(404, "Category not found");
    if (category.dishes.length > 0) {
        throw new httpError_1.HttpError(400, "Delete or move the dishes first");
    }
    await prisma_1.prisma.category.delete({ where: { id } });
}
// ---------- Dishes ----------
async function assertCategoryOwned(restaurantId, categoryId) {
    const category = await prisma_1.prisma.category.findFirst({
        where: { id: categoryId, restaurantId },
    });
    if (!category)
        throw new httpError_1.HttpError(404, "Category not found");
}
async function createDish(userId, data) {
    const restaurantId = await getRestaurantId(userId);
    await assertCategoryOwned(restaurantId, data.categoryId);
    return prisma_1.prisma.dish.create({ data });
}
async function updateDish(userId, id, data) {
    const restaurantId = await getRestaurantId(userId);
    const dish = await prisma_1.prisma.dish.findFirst({
        where: { id, category: { restaurantId } },
    });
    if (!dish)
        throw new httpError_1.HttpError(404, "Dish not found");
    if (data.categoryId)
        await assertCategoryOwned(restaurantId, data.categoryId);
    return prisma_1.prisma.dish.update({ where: { id }, data });
}
async function deleteDish(userId, id) {
    const restaurantId = await getRestaurantId(userId);
    const dish = await prisma_1.prisma.dish.findFirst({
        where: { id, category: { restaurantId } },
    });
    if (!dish)
        throw new httpError_1.HttpError(404, "Dish not found");
    try {
        await prisma_1.prisma.dish.delete({ where: { id } });
    }
    catch {
        // The dish is already used in orders: hide it instead of deleting it
        await prisma_1.prisma.dish.update({ where: { id }, data: { available: false } });
    }
}
