import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { recoveryService } from '../services/recoveryService.js';

export const logRecovery = asyncHandler(async (req, res) => {
  const recovery = await recoveryService.logRecovery(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, recovery, 'Recovery entry logged successfully'));
});

export const getRecoveryHistory = asyncHandler(async (req, res) => {
  const history = await recoveryService.getRecoveryHistory(req.user.id);
  return res.status(200).json(new ApiResponse(200, history, 'Recovery history fetched successfully'));
});

export const getRecoveryStats = asyncHandler(async (req, res) => {
  const stats = await recoveryService.getRecoveryStats(req.user.id);
  return res.status(200).json(new ApiResponse(200, stats, 'Recovery statistics fetched successfully'));
});

export default {
  logRecovery,
  getRecoveryHistory,
  getRecoveryStats,
};
