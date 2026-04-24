import { ApiResponse } from "../config/ApiHandler.js";
import { ApiError } from "../config/ErrorHandler.js";
import { asyncHandler } from "../config/asyncHandler.js";
import UserModel from "../model/user.model.js";
import WorkoutLogModel from "../model/workout_log.model.js";

const logWorkoutController = asyncHandler(async(req,res) => {
       const {userId} = req.user.id 

       const {exercise,duration,date,notes} = req.body 
       
       const isProfile = await UserModel.findById({userId})

       if(!isProfile){
        throw new ApiError(404,"User not found")
       } 
      
       const isWorkoutLogExisted = await WorkoutLogModel.findOne({userId:userId,date:date})

       if(isWorkoutLogExisted){
        throw new ApiError(400,"Workout log for this date already exists")
       }

       const workoutLogCreate  = await WorkoutLogModel.create({
         userId:userId,
        exercise:exercise,
        duration,
        date,
        notes
       }) 

       const message = workoutLogCreate ? "Workout log created successfully" : "Failed to create workout log"

       res.status(201).json(new ApiResponse(201,workoutLogCreate,message))

})

const getWorkoutLogsController = asyncHandler(async(req,res) => {
    const {userId} = req.user.id 

    const isProfile = await UserModel.findById({userId})

    if(!isProfile){
     throw new ApiError(404,"User not found")
    }

    const workoutLogs = await WorkoutLogModel.find({userId:userId}).sort({date:-1})

    const message = workoutLogs.length > 0 ? "Workout logs fetched successfully" : "No workout logs found for this user"

    res.status(200).json(new ApiResponse(200,workoutLogs,message))

}) 

const getWorkoutLogByIdController = asyncHandler(async(req,res) => {
    const {userId} = req.user.id 
    const {logId} = req.params

    const isProfile = await UserModel.findById({userId})

    if(!isProfile){
     throw new ApiError(404,"User not found")
    }

    const workoutLog = await WorkoutLogModel.findOne({_id:logId,userId:userId})

    if(!workoutLog){
        throw new ApiError(404,"Workout log not found")
    }

    res.status(200).json(new ApiResponse(200,workoutLog,"Workout log fetched successfully"))

})

const deleteWorkoutLogController = asyncHandler(async(req,res) => {
    const {userId} = req.user.id 
    const {logId} = req.params

    const isProfile = await UserModel.findById({userId})

    if(!isProfile){
     throw new ApiError(404,"User not found")
    }

    const workoutLog = await WorkoutLogModel.findOne({_id:logId,userId:userId})

    if(!workoutLog){
        throw new ApiError(404,"Workout log not found")
    }

    await WorkoutLogModel.findByIdAndDelete(logId)

    res.status(200).json(new ApiResponse(200,{}, "Workout log deleted successfully"))

}) 

export {
    logWorkoutController,
    getWorkoutLogByIdController,
    getWorkoutLogsController,
    deleteWorkoutLogController
}