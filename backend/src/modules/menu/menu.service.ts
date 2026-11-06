import { prisma } from "../../config/prisma";
import { HttpError } from "../../utils/httpError";

async function getRestaurantId(userId: number) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: userId },
  });
  if (!restaurant) throw new HttpError(404, "No restaurant for this account");
  return restaurant.id;
}

// ---------- Categories ----------
export async function createCategory(userId: number, name: string) {
  const restaurantId = await getRestaurantId(userId);
  return prisma.category.create({ data: { name, restaurantId } });
}

export async function listMyCategories(userId: number) {
  const restaurantId = await getRestaurantId(userId);
  return prisma.category.findMany({
    where: { restaurantId },
    include: { dishes: true },
  });
}

export async function deleteCategory(userId: number, id: number) {
  const restaurantId = await getRestaurantId(userId);
  const category = await prisma.category.findFirst({
    where: { id, restaurantId },
    include: { dishes: true },
  });
  if (!category) throw new HttpError(404, "Category not found");
  if (category.dishes.length > 0) {
    throw new HttpError(400, "Delete or move the dishes first");
  }
  await prisma.category.delete({ where: { id } });
}

// ---------- Dishes ----------
async function assertCategoryOwned(restaurantId: number, categoryId: number) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, restaurantId },
  });
  if (!category) throw new HttpError(404, "Category not found");
}

export async function createDish(
  userId: number,
  data: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    available?: boolean;
    categoryId: number;
  }
) {
  const restaurantId = await getRestaurantId(userId);
  await assertCategoryOwned(restaurantId, data.categoryId);
  return prisma.dish.create({ data });
}

export async function updateDish(
  userId: number,
  id: number,
  data: Record<string, unknown> & { categoryId?: number }
) {
  const restaurantId = await getRestaurantId(userId);
  const dish = await prisma.dish.findFirst({
    where: { id, category: { restaurantId } },
  });
  if (!dish) throw new HttpError(404, "Dish not found");
  if (data.categoryId) await assertCategoryOwned(restaurantId, data.categoryId);
  return prisma.dish.update({ where: { id }, data });
}

export async function deleteDish(userId: number, id: number) {
  const restaurantId = await getRestaurantId(userId);
  const dish = await prisma.dish.findFirst({
    where: { id, category: { restaurantId } },
  });
  if (!dish) throw new HttpError(404, "Dish not found");
  try {
    await prisma.dish.delete({ where: { id } });
  } catch {
    // The dish is already used in orders: hide it instead of deleting it
    await prisma.dish.update({ where: { id }, data: { available: false } });
  }
}