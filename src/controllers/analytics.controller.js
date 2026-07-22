import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { analyticsService } from '../services/analyticsService.js';

export const getOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverview(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, 'Analytics overview fetched successfully'));
});

export const getWorkoutsAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getWorkoutsAnalytics(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, 'Workouts analytics fetched successfully'));
});

export const getProgressAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getProgressAnalytics(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, 'Progress analytics fetched successfully'));
});

export const getRecoveryAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRecoveryAnalytics(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, 'Recovery analytics fetched successfully'));
});

export default {
  getOverview,
  getWorkoutsAnalytics,
  getProgressAnalytics,
  getRecoveryAnalytics,
};
