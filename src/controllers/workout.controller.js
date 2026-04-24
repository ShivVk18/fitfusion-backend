import { ApiResponse } from "../config/ApiHandler.js";
import { ApiError } from "../config/ErrorHandler.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { generateWorkoutPlan } from "../AiServices/workout.generate.js";
import UserModel from "../model/user.model.js";
import WorkoutModel from "../model/workout.model.js";

const generateWorkoutPlanController = asyncHandler(async(req,res)=> {
    const {userId} = req.user.id 

    const {DaysPerWeek} = req.body 

    if(!DaysPerWeek || isNaN(DaysPerWeek) || DaysPerWeek < 1 || DaysPerWeek > 7){
        throw new ApiError(400,"DaysPerWeek must be a number between 1 and 7")
    } 

    const profile = await UserModel.findById({userId}).select(-password -refreshToken)

    if(!profile){
        throw new ApiError(404,"User not found")
    }

    const workoutPlan = await generateWorkoutPlan(profile,DaysPerWeek) 

    const workoutPlanCreate = await WorkoutModel.create({
        userId:userId,
        plan_name:workoutPlan.plan_name,
        split_type:workoutPlan.split_type,
        days:workoutPlan.days,
        created_by_AI:true,
        duration:workoutPlan.duration
    }) 

    res.status(200).json(new ApiResponse(200,workoutPlanCreate,"Workout Plan Generated Successfully"))
})

const getWorkoutPlans = asyncHandler(async(req,res) => {
    const {userId} = req.user.id 


    const isProfile = await UserModel.findById({userId})

    if(!isProfile){
        throw new ApiError(404,"User not found")
    }

    const workoutPlans = await WorkoutModel.find({userId:userId}) 
    
    const message = workoutPlans.length > 0 ? "Workout Plans fetched successfully" : "No workout plans found for this user" 

    res.status(200).json(new ApiResponse(200,workoutPlans,message)) 




})

const getWorkoutPlanById = asyncHandler(async(req,res) => {
    const {userId} = req.user.id 
    const {planId} = req.params

    const isProfile = await UserModel.findById({userId})

    if(!isProfile){
        throw new ApiError(404,"User not found")
    }

    const workoutPlan = await WorkoutModel.findOne({_id:planId,userId:userId})

    if(!workoutPlan){
        throw new ApiError(404,"Workout plan not found")
    }

    res.status(200).json(new ApiResponse(200,workoutPlan,"Workout Plan fetched successfully")) 
}) 


const deleteWorkoutPlan = asyncHandler(async(req,res) => {
    const {userId} = req.user.id 
    const {planId} = req.params

    const isProfile = await UserModel.findById({userId})

    if(!isProfile){
        throw new ApiError(404,"User not found")
    }

    const workoutPlan = await WorkoutModel.findOne({_id:planId,userId:userId})

    if(!workoutPlan){
        throw new ApiError(404,"Workout plan not found")
    }

    await WorkoutModel.findByIdAndDelete(planId)

    res.status(200).json(new ApiResponse(200,{}, "Workout Plan deleted successfully")) 
})

export {
    generateWorkoutPlanController,
    getWorkoutPlans,
    getWorkoutPlanById,
    deleteWorkoutPlan
}