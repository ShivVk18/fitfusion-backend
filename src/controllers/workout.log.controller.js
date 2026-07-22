import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { workoutLogService } from '../services/workoutLogService.js';

export const logWorkoutController = asyncHandler(async (req, res) => {
  const workoutLog = await workoutLogService.logWorkout(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, workoutLog, 'Workout log created successfully'));
});

export const getWorkoutLogsController = asyncHandler(async (req, res) => {
  const workoutLogs = await workoutLogService.getWorkoutLogs(req.user.id);
  const message = workoutLogs.length > 0 ? 'Workout logs fetched successfully' : 'No workout logs found for this user';
  return res.status(200).json(new ApiResponse(200, workoutLogs, message));
});

export const getWorkoutLogByIdController = asyncHandler(async (req, res) => {
  const workoutLog = await workoutLogService.getWorkoutLogById(req.user.id, req.params.logId);
  return res.status(200).json(new ApiResponse(200, workoutLog, 'Workout log fetched successfully'));
});

export const deleteWorkoutLogController = asyncHandler(async (req, res) => {
  await workoutLogService.deleteWorkoutLog(req.user.id, req.params.logId);
  return res.status(200).json(new ApiResponse(200, {}, 'Workout log deleted successfully'));
});

export default {
  logWorkoutController,
  getWorkoutLogsController,
  getWorkoutLogByIdController,
  deleteWorkoutLogController,
};