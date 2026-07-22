import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { aiService } from '../services/aiService.js';
import { profileService } from '../services/profileService.js';
import { progressService } from '../services/progressService.js';
import { recoveryService } from '../services/recoveryService.js';

const checkProfileSetup = (userProfile) => {
  if (!userProfile.isProfileSetup || !userProfile.weight || !userProfile.fitnessGoal) {
    throw new ApiError(400, 'Please complete your Profile setup (age, weight, height, fitness goal) before generating AI plans.');
  }
};

export const generateWorkoutPlan = asyncHandler(async (req, res) => {
  const userProfile = await profileService.getProfile(req.user.id);
  checkProfileSetup(userProfile);

  const daysPerWeek = Number(req.body.daysPerWeek || req.body.DaysPerWeek || 4);
  const plan = await aiService.generateWorkoutPlan(req.user.id, userProfile, daysPerWeek);
  return res.status(200).json(new ApiResponse(200, plan, 'AI workout plan generated successfully'));
});

export const analyzeProgress = asyncHandler(async (req, res) => {
  const userProfile = await profileService.getProfile(req.user.id);
  checkProfileSetup(userProfile);

  const stats = await progressService.getProgressStats(req.user.id);
  const history = await progressService.getProgressHistory(req.user.id);

  const analysis = await aiService.analyzeProgress(req.user.id, userProfile, stats, history);
  return res.status(200).json(new ApiResponse(200, analysis, 'AI progress analysis completed successfully'));
});

export const generateDietPlan = asyncHandler(async (req, res) => {
  const userProfile = await profileService.getProfile(req.user.id);
  checkProfileSetup(userProfile);

  const dietPreferences = req.body || {};
  const dietPlan = await aiService.generateDietPlan(req.user.id, userProfile, dietPreferences);
  return res.status(200).json(new ApiResponse(200, dietPlan, 'AI diet plan generated successfully'));
});

export const generateRecoveryAdvice = asyncHandler(async (req, res) => {
  const userProfile = await profileService.getProfile(req.user.id);
  checkProfileSetup(userProfile);

  const recoveryStats = await recoveryService.getRecoveryStats(req.user.id);
  const advice = await aiService.generateRecoveryAdvice(req.user.id, userProfile, recoveryStats);
  return res.status(200).json(new ApiResponse(200, advice, 'AI recovery advice generated successfully'));
});

export const handleAiChat = asyncHandler(async (req, res) => {
  const userProfile = await profileService.getProfile(req.user.id);
  checkProfileSetup(userProfile);

  const { message, context } = req.body;
  const chatResponse = await aiService.chat(req.user.id, userProfile, context || {}, message || 'Give me a fitness tip.');
  return res.status(200).json(new ApiResponse(200, chatResponse, 'AI response received successfully'));
});

export const getAiHistory = asyncHandler(async (req, res) => {
  const history = await aiService.getAiHistory(req.user.id);
  return res.status(200).json(new ApiResponse(200, history, 'AI history fetched successfully'));
});

export default {
  generateWorkoutPlan,
  analyzeProgress,
  generateDietPlan,
  generateRecoveryAdvice,
  handleAiChat,
  getAiHistory,
};