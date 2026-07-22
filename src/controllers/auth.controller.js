import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { authService } from '../services/authService.js';
import { getCookieOptions } from '../utils/auth.utils.js';

export const userSignUp = asyncHandler(async (req, res) => {
  const user = await authService.signUp(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
});

export const userSignIn = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.signIn(req.body);
  const accessTokenCookieOptions = getCookieOptions(false);
  const refreshTokenCookieOptions = getCookieOptions(true);

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenCookieOptions)
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        'User signed in successfully'
      )
    );
});

export const userSignOut = asyncHandler(async (req, res) => {
  await authService.signOut(req.user.id);
  const accessTokenCookieOptions = getCookieOptions(false);
  const refreshTokenCookieOptions = getCookieOptions(true);

  return res
    .status(200)
    .clearCookie('accessToken', accessTokenCookieOptions)
    .clearCookie('refreshToken', refreshTokenCookieOptions)
    .json(new ApiResponse(200, {}, 'User signed out successfully'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  return res.status(200).json(new ApiResponse(200, user, 'Current user profile fetched successfully'));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  const { user, accessToken, refreshToken } = await authService.refreshAccessToken(incomingRefreshToken);

  const accessTokenCookieOptions = getCookieOptions(false);
  const refreshTokenCookieOptions = getCookieOptions(true);

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenCookieOptions)
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        'Access token refreshed successfully'
      )
    );
});

export default {
  userSignUp,
  userSignIn,
  userSignOut,
  getCurrentUser,
  refreshAccessToken,
};