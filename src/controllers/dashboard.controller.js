import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { dashboardService } from '../services/dashboardService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardData(req.user.id);
  return res.status(200).json(new ApiResponse(200, data, 'Dashboard overview fetched successfully'));
});

export default {
  getDashboard,
};
