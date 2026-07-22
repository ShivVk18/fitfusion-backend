import { prisma } from '../lib/prisma.js';
import ApiError from '../utils/ApiError.js';

export const workoutLogService = {
  async logWorkout(userId, logData) {
    const { exercise, exercises, duration, date, notes, workoutId } = logData;

    const logDate = date || new Date().toISOString().split('T')[0];
    const rawExercises = exercises || exercise || [];

    const existingLog = await prisma.workoutLog.findFirst({
      where: { userId, date: logDate },
    });

    if (existingLog) {
      throw new ApiError(400, 'Workout log for this date already exists');
    }

    const workoutLog = await prisma.workoutLog.create({
      data: {
        userId,
        workoutId: workoutId || null,
        date: logDate,
        duration: duration || '45 mins',
        notes: notes || '',
        exercises: {
          create: rawExercises.map((ex) => ({
            name: ex.name,
            sets: String(ex.sets),
            reps: String(ex.reps),
            weight: String(ex.weight || ex.Weight || '0'),
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return workoutLog;
  },

  async getWorkoutLogs(userId) {
    const logs = await prisma.workoutLog.findMany({
      where: { userId },
      include: { exercises: true, workout: true },
      orderBy: { date: 'desc' },
    });
    return logs;
  },

  async getWorkoutLogById(userId, logId) {
    const log = await prisma.workoutLog.findFirst({
      where: { id: logId, userId },
      include: { exercises: true, workout: true },
    });

    if (!log) throw new ApiError(404, 'Workout log not found');
    return log;
  },

  async deleteWorkoutLog(userId, logId) {
    const log = await prisma.workoutLog.findFirst({
      where: { id: logId, userId },
    });

    if (!log) throw new ApiError(404, 'Workout log not found');

    await prisma.workoutLog.delete({
      where: { id: logId },
    });

    return true;
  },
};

export default workoutLogService;
