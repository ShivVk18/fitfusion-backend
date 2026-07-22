import { prisma } from '../lib/prisma.js';
import ApiError from '../utils/ApiError.js';

export const dietService = {
  async createDiet(userId, dietData) {
    const { calories, protein, protien, carbs, fats, diet_type, dietType, goal, meals, mealTimings, date } = dietData;
    const entryDate = date || new Date().toISOString().split('T')[0];

    const diet = await prisma.diet.create({
      data: {
        userId,
        calories: String(calories),
        protein: String(protein || protien || '0'),
        carbs: String(carbs || '0'),
        fats: String(fats || '0'),
        dietType: dietType || diet_type || 'Balanced',
        goal: goal || 'Maintenance',
        meals: meals || [],
        mealTimings: mealTimings || [],
        date: entryDate,
      },
    });

    return diet;
  },

  async getDiets(userId) {
    const diets = await prisma.diet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return diets;
  },

  async getTodayDiet(userId) {
    const today = new Date().toISOString().split('T')[0];
    const diet = await prisma.diet.findFirst({
      where: { userId, date: today },
    });
    if (!diet) {
      // Return latest diet if today's not explicitly logged
      return await prisma.diet.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }
    return diet;
  },

  async updateDiet(userId, dietId, updateData) {
    const diet = await prisma.diet.findFirst({ where: { id: dietId, userId } });
    if (!diet) throw new ApiError(404, 'Diet entry not found');

    const updated = await prisma.diet.update({
      where: { id: dietId },
      data: {
        calories: updateData.calories !== undefined ? String(updateData.calories) : diet.calories,
        protein: updateData.protein !== undefined ? String(updateData.protein) : (updateData.protien !== undefined ? String(updateData.protien) : diet.protein),
        carbs: updateData.carbs !== undefined ? String(updateData.carbs) : diet.carbs,
        fats: updateData.fats !== undefined ? String(updateData.fats) : diet.fats,
        dietType: updateData.dietType || updateData.diet_type || diet.dietType,
        goal: updateData.goal || diet.goal,
        meals: updateData.meals !== undefined ? updateData.meals : diet.meals,
        mealTimings: updateData.mealTimings !== undefined ? updateData.mealTimings : diet.mealTimings,
      },
    });

    return updated;
  },

  async deleteDiet(userId, dietId) {
    const diet = await prisma.diet.findFirst({ where: { id: dietId, userId } });
    if (!diet) throw new ApiError(404, 'Diet entry not found');

    await prisma.diet.delete({ where: { id: dietId } });
    return true;
  },
};

export default dietService;
