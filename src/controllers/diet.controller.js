import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { dietService } from '../services/dietService.js';

export const createDiet = asyncHandler(async (req, res) => {
  const diet = await dietService.createDiet(req.user.id, req.body);
  return res.status(201).json(new ApiResponse(201, diet, 'Diet plan created successfully'));
});

export const getDiet = asyncHandler(async (req, res) => {
  const diets = await dietService.getDiets(req.user.id);
  return res.status(200).json(new ApiResponse(200, diets, 'Diet history fetched successfully'));
});

export const updateDiet = asyncHandler(async (req, res) => {
  const updatedDiet = await dietService.updateDiet(req.user.id, req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, updatedDiet, 'Diet updated successfully'));
});

export const deleteDiet = asyncHandler(async (req, res) => {
  await dietService.deleteDiet(req.user.id, req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, 'Diet entry deleted successfully'));
});

export default {
  createDiet,
  getDiet,
  updateDiet,
  deleteDiet,
};
