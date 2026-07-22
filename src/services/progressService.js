import { prisma } from '../lib/prisma.js';

export const weightTrend = (progress) => {
  if (!progress || progress.length < 2) return "No trend";

  const sorted = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstWeight = parseFloat(sorted[0].weight);
  const lastWeight = parseFloat(sorted[sorted.length - 1].weight);

  if (isNaN(firstWeight) || isNaN(lastWeight)) return "No trend";
  if (lastWeight < firstWeight) return "Decreasing";
  if (lastWeight > firstWeight) return "Increasing";
  return "Stable";
};

export const calculateWeeklyChange = (progress) => {
  if (!progress || progress.length < 2) return 0;

  const sorted = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstWeight = parseFloat(first.weight);
  const lastWeight = parseFloat(last.weight);

  if (isNaN(firstWeight) || isNaN(lastWeight)) return 0;

  const weeks = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24 * 7);
  if (weeks <= 0) return 0;

  return Number(((lastWeight - firstWeight) / weeks).toFixed(2));
};

export const detectPlateau = (progress) => {
  if (!progress || progress.length < 3) return false;

  const sorted = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recent = sorted.slice(-4).map((p) => parseFloat(p.weight)).filter((w) => !isNaN(w));

  if (recent.length < 3) return false;

  const maxWeight = Math.max(...recent);
  const minWeight = Math.min(...recent);

  return (maxWeight - minWeight) < 0.5;
};

export const analyzeStrength = (progress) => {
  if (!progress || progress.length < 2) return { chestTrend: "No data", bicepsTrend: "No data" };

  const sorted = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstChest = parseFloat(first.chest) || 0;
  const lastChest = parseFloat(last.chest) || 0;

  const firstBiceps = parseFloat(first.biceps) || 0;
  const lastBiceps = parseFloat(last.biceps) || 0;

  const chestTrend = lastChest > firstChest ? "Increasing" : (lastChest < firstChest ? "Decreasing" : "Stable");
  const bicepsTrend = lastBiceps > firstBiceps ? "Increasing" : (lastBiceps < firstBiceps ? "Decreasing" : "Stable");

  return { chestTrend, bicepsTrend };
};

export const generateBasicRecommendations = (progress) => {
  const trend = weightTrend(progress);
  const weeklyChange = calculateWeeklyChange(progress);
  const plateau = detectPlateau(progress);
  const strength = analyzeStrength(progress);

  const recs = [];

  if (trend === "Increasing") {
    recs.push("Weight is trending upwards. Adjust caloric balance based on your bulking/cutting goal.");
  } else if (trend === "Decreasing") {
    recs.push("Steady fat loss rate detected. Keep up your current daily activity and deficit.");
  } else {
    recs.push("Weight is maintaining stable. Ideal phase for progressive overload strength gains.");
  }

  if (weeklyChange > 0.75) {
    recs.push("Weekly weight change > 0.75kg/week. Slow down slightly for lean muscle preservation.");
  } else if (weeklyChange < -0.75) {
    recs.push("Weight drop rate is aggressive. Ensure protein intake remains high to protect muscle mass.");
  }

  if (plateau) {
    recs.push("Weight plateau detected over recent logs. Consider a minor refeed day or deload week.");
  }

  if (strength.chestTrend === "Increasing") {
    recs.push("Chest measurements are advancing upward continuously.");
  }
  if (strength.bicepsTrend === "Increasing") {
    recs.push("Arm circumference shows steady hypertrophic growth.");
  }

  return recs;
};

export const progressService = {
  weightTrend,
  generateBasicRecommendations,
  async addProgress(userId, progressData) {
    const { weight, body_fat, bodyFat, chest, waist, biceps, date } = progressData;
    const entryDate = date || new Date().toISOString().split('T')[0];

    const progress = await prisma.progress.create({
      data: {
        userId,
        weight: String(weight),
        bodyFat: bodyFat !== undefined ? String(bodyFat) : (body_fat !== undefined ? String(body_fat) : null),
        chest: chest !== undefined ? String(chest) : null,
        waist: waist !== undefined ? String(waist) : null,
        biceps: biceps !== undefined ? String(biceps) : null,
        date: entryDate,
      },
    });

    return progress;
  },

  async getProgressHistory(userId) {
    const progress = await prisma.progress.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return progress;
  },

  async getProgressStats(userId) {
    const progress = await prisma.progress.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    const stats = {
      weightTrend: weightTrend(progress),
      weeklyChange: calculateWeeklyChange(progress),
      plateau: detectPlateau(progress),
      strengthAnalysis: analyzeStrength(progress),
      recommendations: generateBasicRecommendations(progress),
      totalEntries: progress.length,
      latestWeight: progress.length > 0 ? progress[progress.length - 1].weight : null,
    };

    return stats;
  },
};

export default progressService;
