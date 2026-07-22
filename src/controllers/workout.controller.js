import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { workoutService } from '../services/workoutService.js';
import { aiService } from '../services/aiService.js';
import { profileService } from '../services/profileService.js';

export const generateWorkoutPlanController = asyncHandler(async (req, res) => {
  const daysPerWeek = Number(req.body.DaysPerWeek || req.body.daysPerWeek || 4);
  const userProfile = await profileService.getProfile(req.user.id);
  
  const generatedPlan = await aiService.generateWorkoutPlan(req.user.id, userProfile, daysPerWeek);
  const savedWorkout = await workoutService.createWorkoutPlan(req.user.id, generatedPlan);

  return res.status(200).json(new ApiResponse(200, savedWorkout, 'Workout plan generated successfully'));
});

export const getWorkoutPlans = asyncHandler(async (req, res) => {
  const workoutPlans = await workoutService.getUserWorkouts(req.user.id);
  const message = workoutPlans.length > 0 ? 'Workout plans fetched successfully' : 'No workout plans found for this user';
  return res.status(200).json(new ApiResponse(200, workoutPlans, message));
});

export const getWorkoutPlanById = asyncHandler(async (req, res) => {
  const workoutPlan = await workoutService.getWorkoutById(req.user.id, req.params.planId);
  return res.status(200).json(new ApiResponse(200, workoutPlan, 'Workout plan fetched successfully'));
});

export const deleteWorkoutPlan = asyncHandler(async (req, res) => {
  await workoutService.deleteWorkoutPlan(req.user.id, req.params.planId);
  return res.status(200).json(new ApiResponse(200, {}, 'Workout plan deleted successfully'));
});

export default {
  generateWorkoutPlanController,
  getWorkoutPlans,
  getWorkoutPlanById,
  deleteWorkoutPlan,
};