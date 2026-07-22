import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { profileService } from '../services/profileService.js';

export const createProfile = asyncHandler(async (req, res) => {
  const updatedProfile = await profileService.createProfile(req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedProfile, 'Profile created successfully'));
});

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile(req.user.id);
  return res.status(200).json(new ApiResponse(200, profile, 'User profile fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedProfile = await profileService.updateProfile(req.user.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedProfile, 'Profile updated successfully'));
});

export default {
  createProfile,
  getProfile,
  updateProfile,
};