import { prisma } from '../lib/prisma.js';
import { progressService } from './progressService.js';
import { recoveryService } from './recoveryService.js';

export const dashboardService = {
  async getDashboardData(userId) {
    const today = new Date().toISOString().split('T')[0];
    const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Fetch in parallel
    const [
      user,
      activePlan,
      userWorkoutLogs,
      progressHistory,
      recoveryHistory,
      latestDiet,
      latestAIHistory,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { weight: true },
      }),
      prisma.workout.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { days: { include: { exercises: true } } },
      }),
      prisma.workoutLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        include: { exercises: true },
      }),
      prisma.progress.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
      }),
      prisma.recovery.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 1,
      }),
      prisma.diet.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.AIHistory.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Today's workout
    let todaysWorkout = null;
    if (activePlan && activePlan.days.length > 0) {
      todaysWorkout =
        activePlan.days.find((d) => d.day.toLowerCase() === todayDayName.toLowerCase()) ||
        activePlan.days[0];
    }

    // Weekly workouts count
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyWorkouts = userWorkoutLogs.filter(
      (log) => new Date(log.date) >= sevenDaysAgo
    ).length;

    // Workout completion percentage (last 7 days target e.g. 4 days)
    const targetDaysPerWeek = activePlan?.days?.length || 4;
    const workoutCompletionPercentage = Math.min(
      100,
      Math.round((weeklyWorkouts / Math.max(1, targetDaysPerWeek)) * 100)
    );

    // Streak calculation
    let streak = 0;
    const sortedLogDates = Array.from(new Set(userWorkoutLogs.map((l) => l.date))).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    if (sortedLogDates.length > 0) {
      let currentCheck = new Date();
      for (const dateStr of sortedLogDates) {
        const logDate = new Date(dateStr);
        const diffDays = Math.floor((currentCheck - logDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          streak++;
          currentCheck = logDate;
        } else {
          break;
        }
      }
    }

    // Weight progress
    const startingWeight = user?.weight || (progressHistory.length > 0 ? progressHistory[0].weight : null);
    const latestWeight = progressHistory.length > 0 ? progressHistory[progressHistory.length - 1].weight : startingWeight;
    const weightTrend = progressService.weightTrend ? progressService.weightTrend(progressHistory) : 'Stable';

    // Strength progress
    const strengthProgress = progressHistory.length >= 2
      ? {
          chest: progressHistory[progressHistory.length - 1].chest || '0',
          biceps: progressHistory[progressHistory.length - 1].biceps || '0',
          change: 'Positive',
        }
      : { chest: '0', biceps: '0', change: 'Baseline' };

    // Recovery score
    const recoveryScore = recoveryHistory.length > 0 ? recoveryHistory[0].recoveryScore : 85;

    // AI Recommendation
    let aiRecommendation = "Consistency is key! Keep tracking workouts and maintain proper post-exercise hydration.";
    if (latestAIHistory?.responseData?.recommendations) {
      const recs = latestAIHistory.responseData.recommendations;
      aiRecommendation = Array.isArray(recs) ? recs[0] : recs;
    } else if (progressHistory.length > 0) {
      const recs = progressService.generateBasicRecommendations(progressHistory);
      if (recs.length > 0) aiRecommendation = recs[0];
    }

    return {
      currentWorkoutPlan: activePlan,
      todaysWorkout,
      workoutCompletionPercentage,
      weeklyWorkouts,
      currentStreak: streak,
      weightProgress: {
        current: latestWeight || '75',
        start: startingWeight || '75',
        trend: weightTrend,
      },
      strengthProgress,
      recoveryScore,
      aiRecommendations: [aiRecommendation],
      calories: latestDiet?.calories || '2200',
      proteinIntake: latestDiet?.protein || '150g',
    };
  },
};

export default dashboardService;
