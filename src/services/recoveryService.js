import { prisma } from '../lib/prisma.js';
import ApiError from '../utils/ApiError.js';

export const calculateRecoveryScore = ({ sleepHours = 7, soreness = 3, fatigue = 3, stress = 3, hydration = 2.5 }) => {
  const sleepVal = parseFloat(sleepHours) || 7;
  const sorenessVal = parseInt(soreness) || 3;
  const fatigueVal = parseInt(fatigue) || 3;
  const stressVal = parseInt(stress) || 3;
  const hydrationVal = parseFloat(hydration) || 2.5;

  let score = 100 - (fatigueVal * 3.5) - (sorenessVal * 3.5) - (stressVal * 3.0) + (sleepVal * 4.5) + (hydrationVal * 3.0);
  score = Math.max(0, Math.min(100, Math.round(score)));
  return score;
};

export const recoveryService = {
  async logRecovery(userId, recoveryData) {
    const { sleepHours, soreness, fatigue, stress, hydration, date } = recoveryData;
    const entryDate = date || new Date().toISOString().split('T')[0];

    const score = calculateRecoveryScore({ sleepHours, soreness, fatigue, stress, hydration });

    const recovery = await prisma.recovery.create({
      data: {
        userId,
        sleepHours: parseFloat(sleepHours),
        soreness: parseInt(soreness),
        fatigue: parseInt(fatigue),
        stress: parseInt(stress),
        hydration: parseFloat(hydration),
        recoveryScore: score,
        date: entryDate,
      },
    });

    return recovery;
  },

  async getRecoveryHistory(userId) {
    const history = await prisma.recovery.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return history;
  },

  async getRecoveryStats(userId) {
    const history = await prisma.recovery.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    if (history.length === 0) {
      return {
        latestScore: 85,
        avgSleep: 7.5,
        avgHydration: 2.5,
        avgFatigue: 3,
        avgSoreness: 3,
        status: 'Optimal',
        recommendation: 'Good default recovery baseline. Keep tracking daily metrics.',
      };
    }

    const latest = history[history.length - 1];
    const avgSleep = history.reduce((acc, curr) => acc + curr.sleepHours, 0) / history.length;
    const avgScore = history.reduce((acc, curr) => acc + curr.recoveryScore, 0) / history.length;

    let status = 'Optimal';
    let recommendation = 'Your recovery is on track. Great sleep and hydration balance!';

    if (latest.recoveryScore < 50) {
      status = 'Poor';
      recommendation = 'High fatigue & stress detected. Consider an active recovery day or extra sleep.';
    } else if (latest.recoveryScore < 75) {
      status = 'Moderate';
      recommendation = 'Recovery is moderate. Focus on proper post-workout nutrition and hydration.';
    }

    return {
      latestScore: latest.recoveryScore,
      avgSleep: Number(avgSleep.toFixed(1)),
      avgScore: Number(avgScore.toFixed(1)),
      latest,
      status,
      recommendation,
      totalEntries: history.length,
    };
  },
};

export default recoveryService;
