
import UserModel from "../model/user.model.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { ApiError } from "../config/ErrorHandler.js";
import { ApiResponse } from "../config/ApiHandler.js";
import { generateToken, getCookieOptions, updateRefreshToken } from "../config/auth.utils.js";

const userSignUp = asyncHandler(async(req,res)=>{
         const {firstName,secondName,password,username,email} = req.body


         const requiredFields = [username, email, password, phone,firstName ];
         

         if(requiredFields.some((field) => !field?.trim())){
            throw new ApiError(402,"Required Fields shoul not be empty")
         }

         const userExists = await UserModel.findOne({
            $or:[
              {email},
              {username}
            ]
         })

         if(userExists){
            throw new ApiError(409,"User already exists")
         }

         const user = await UserModel.create({
            FirstName:firstName,
            SecondName:secondName,
            email,
            password,
            username,
            
            
            isProfileSetup:false
         }) 

         const updatedUser = await UserModel.findById(user._id).select("-password,-refreshToken")

         res.status(201).json(new ApiResponse(201,updatedUser,"User Created Successfully"))
})  


const userSignIn = asyncHandler(async (req, res) => {
  const { signInType, username, email, password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  let query = {};

  switch (Number(signInType)) {
    case 1:
      if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
      }

      query.email = email.trim().toLowerCase();
      break;

    case 2:
      if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
      }

      query.username = username.trim();
      break;

    default:
      throw new ApiError(400, "Invalid sign in type");
  }

  const user = await UserModel.findOne(query);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateToken(user);

  await updateRefreshToken(user._id, refreshToken);

  const loggedInUser = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = getCookieOptions();

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User signed in successfully"
      )
    );
});

const userSignOut = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await clearRefreshToken(userId);    
  
   const options = getCookieOptions()

  res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User signed out successfully"));
});   





export {userSignUp, userSignIn,userSignOut}