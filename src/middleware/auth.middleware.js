import UserModel from "../model/user.model.js";
import { ApiError } from "../config/ErrorHandler.js";
import { ApiResponse } from "../config/ApiHandler.js"; 
import { asyncHandler } from "../config/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyToken = async (token) => {
  if (!token) {
    throw new ApiError(401, "Access token required");
  }

  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
};

const authTokenMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await UserModel
      .findById(decodedToken.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};