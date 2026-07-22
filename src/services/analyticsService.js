import { prisma } from '../lib/prisma.js';

export const analyticsService = {
  async getOverview(userId) {
    const [workouts, logs, progress, recovery, diets] = await Promise.all([
      prisma.workout.count({ where: { userId } }),
      prisma.workoutLog.count({ where: { userId } }),
      prisma.progress.findMany({ where: { userId }, orderBy: { date: 'asc' }, take: 10 }),
      prisma.recovery.findMany({ where: { userId }, orderBy: { date: 'asc' }, take: 10 }),
      prisma.diet.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
    ]);

    return {
      totalWorkoutsCompleted: logs,
      activePlansCount: workouts,
      weightHistory: progress.map((p) => ({ date: p.date, weight: parseFloat(p.weight) || 0 })),
      recoveryScoreTrend: recovery.map((r) => ({ date: r.date, score: r.recoveryScore })),
      nutritionTargets: {
        calories: diets?.calories || '2200',
        protein: diets?.protein || '150g',
        carbs: diets?.carbs || '250g',
        fats: diets?.fats || '70g',
      },
    };
  },

  async getWorkoutsAnalytics(userId) {
    const logs = await prisma.workoutLog.findMany({
      where: { userId },
      include: { exercises: true },
      orderBy: { date: 'asc' },
    });

    const volumeByDate = logs.map((log) => {
      const totalVolume = log.exercises.reduce((acc, ex) => {
        const sets = parseInt(ex.sets) || 1;
        const reps = parseInt(ex.reps) || 10;
        const weight = parseFloat(ex.weight) || 0;
        return acc + (sets * reps * weight);
      }, 0);

      return {
        date: log.date,
        volume: totalVolume,
        durationMins: parseInt(log.duration) || 45,
        exerciseCount: log.exercises.length,
      };
    });

    return {
      totalLogs: logs.length,
      volumeTrend: volumeByDate,
    };
  },

  async getProgressAnalytics(userId) {
    const progress = await prisma.progress.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    return {
      weightChart: progress.map((p) => ({
        date: p.date,
        weight: parseFloat(p.weight) || 0,
        bodyFat: parseFloat(p.bodyFat) || null,
       })),
      measurementsChart: progress.map((p) => ({
        date: p.date,
        chest: parseFloat(p.chest) || 0,
        waist: parseFloat(p.waist) || 0,
        biceps: parseFloat(p.biceps) || 0,
      })),
    };
  },

  async getRecoveryAnalytics(userId) {
    const recoveries = await prisma.recovery.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    return {
      recoveryTrend: recoveries.map((r) => ({
        date: r.date,
        score: r.recoveryScore,
        sleepHours: r.sleepHours,
        hydration: r.hydration,
        fatigue: r.fatigue,
        soreness: r.soreness,
        stress: r.stress,
      })),
    };
  },
};

export default analyticsService;
