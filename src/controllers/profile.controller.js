import UserModel from "../model/user.model.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { ApiError } from "../config/ErrorHandler.js";
import { ApiResponse } from "../config/ApiHandler.js"; 


const createProfile = asyncHandler(async(req,res)=> {
    const {userId}  = req.user.id 

    const {age,gender,Weight,Height,FitnessGoal,ExperienceLevel,Injuries} = req.body



    const required = [age, gender, Weight, Height, FitnessGoal, ExperienceLevel, Injuries].includes((field) => !field?.trim())

    if(required){
        throw new ApiError(400,"All fields are required")
    }

    const updatedProfile = await UserModel.findByIdAndUpdate(userId,{
        age,
        gender,
        Weight,
        Height,
        FitnessGoal,
        ExperienceLevel,
        Injuries,
        isProfileSetup:true
    },{new:true}).select("-password -refreshToken")

    res.status(200).json(new ApiResponse(200,updatedProfile,"Profile Updated Successfully"))


    })


    const getProfile = asyncHandler(async(req,res)=> {
        const {userId} = req.user.id 

        const userProfile = await UserModel.findById(userId).select("-password -refreshToken")

        if(!userProfile){
             throw new ApiError(404,"User not found")
        }

        res.status(200).json(new ApiResponse(200,userProfile,"User Profile fetched successfully"))
    })

    const updateProfile = asyncHandler(async(req,res)=> {
        const {userId} = req.user.id 

        const {username,email,age,gender,Weight,Height,FitnessGoal,ExperienceLevel,Injuries} = req.body 

        const isProfile  = await UserModel.findById(userId)

        if(!isProfile){
            throw new ApiError(404,"User not found")
        }

        const updatedProfile = await UserModel.findByIdAndUpdate(isProfile._id,{
            username:username || isProfile.username,
            email:email || isProfile.email,
            age:age || isProfile.age,
            gender:gender || isProfile.gender,
            Weight:Weight || isProfile.Weight,
            Height:Height || isProfile.Height,
            FitnessGoal:FitnessGoal || isProfile.FitnessGoal,
            ExperienceLevel:ExperienceLevel || isProfile.ExperienceLevel,
            Injuries:Injuries || isProfile.Injuries
        },{new:true}).select("-password -refreshToken")

        res.status(200).json(new ApiResponse(200,updatedProfile,"Profile Updated Successfully") )        
        })

       
        export {createProfile,getProfile,updateProfile}