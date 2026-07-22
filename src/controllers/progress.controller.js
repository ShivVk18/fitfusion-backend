import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { progressService } from '../services/progressService.js';

export const addProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.addProgress(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, progress, 'Progress entry added successfully'));
});

export const getProgress = asyncHandler(async (req, res) => {
  const progressHistory = await progressService.getProgressHistory(req.user.id);
  return res.status(200).json(new ApiResponse(200, progressHistory, 'Progress history fetched successfully'));
});

export const getProgressStats = asyncHandler(async (req, res) => {
  const stats = await progressService.getProgressStats(req.user.id);
  return res.status(200).json(new ApiResponse(200, stats, 'Progress statistics calculated successfully'));
});

export default {
  addProgress,
  getProgress,
  getProgressStats,
};
