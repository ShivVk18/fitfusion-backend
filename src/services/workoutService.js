import { prisma } from '../lib/prisma.js';
import ApiError from '../utils/ApiError.js';

export const workoutService = {
  async createWorkoutPlan(userId, planData) {
    const { plan_name, planName, split_type, splitType, days, duration, created_by_AI, createdByAI } = planData;

    const name = planName || plan_name || 'Personalized Workout Plan';
    const split = splitType || split_type || 'Custom Split';
    const isAi = createdByAI !== undefined ? createdByAI : (created_by_AI !== undefined ? created_by_AI : true);

    const workout = await prisma.workout.create({
      data: {
        userId,
        planName: name,
        splitType: split,
        createdByAI: isAi,
        duration: duration || '4 weeks',
        days: {
          create: (days || []).map((dayObj) => ({
            day: dayObj.day,
            focus: dayObj.focus,
            exercises: {
              create: (dayObj.exercises || []).map((ex) => ({
                name: ex.name,
                sets: String(ex.sets),
                reps: String(ex.reps),
                rest: String(ex.rest),
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            exercises: true,
          },
        },
      },
    });

    return workout;
  },

  async getUserWorkouts(userId) {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: {
        days: {
          include: {
            exercises: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return workouts;
  },

  async getWorkoutById(userId, planId) {
    const workout = await prisma.workout.findFirst({
      where: { id: planId, userId },
      include: {
        days: {
          include: {
            exercises: true,
          },
        },
      },
    });

    if (!workout) throw new ApiError(404, 'Workout plan not found');
    return workout;
  },

  async deleteWorkoutPlan(userId, planId) {
    const workout = await prisma.workout.findFirst({
      where: { id: planId, userId },
    });

    if (!workout) throw new ApiError(404, 'Workout plan not found');

    await prisma.workout.delete({
      where: { id: planId },
    });

    return true;
  },
};

export default workoutService;
