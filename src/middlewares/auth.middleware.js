import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request. Token missing.');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'shivanshaccess');
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        secondName: true,
        isProfileSetup: true,
        fitnessGoal: true,
        experienceLevel: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token. User not found.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'AccessTokenExpired');
    }
    throw new ApiError(401, error?.message || 'Invalid or expired access token.');
  }
});

export default verifyJWT;
