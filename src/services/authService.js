import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import ApiError from '../utils/ApiError.js';
import { generateTokens } from '../utils/auth.utils.js';

export const authService = {
  async signUp({ firstName, secondName, username, email, password }) {

    const db = await prisma.$queryRaw`SELECT current_database() AS db`;

console.log("Current DB:", db);
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username }],
      },
    });

    if (existingUser) {
      throw new ApiError(409, 'User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        secondName,
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
        isProfileSetup: false,
      },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        email: true,
        username: true,
        isProfileSetup: true,
        createdAt: true,
      },
    });

    return user;
  },

  async signIn({ signInType, email, username, password }) {
    let user;

    if (Number(signInType) === 1 || email) {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } else if (Number(signInType) === 2 || username) {
      user = await prisma.user.findUnique({
        where: { username },
      });
    }

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = generateTokens(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const loggedInUser = {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      username: user.username,
      isProfileSetup: user.isProfileSetup,
    };

    return { user: loggedInUser, accessToken, refreshToken };
  },

  async signOut(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return true;
  },

  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        email: true,
        username: true,
        age: true,
        gender: true,
        weight: true,
        height: true,
        fitnessGoal: true,
        experienceLevel: true,
        injuries: true,
        isProfileSetup: true,
        createdAt: true,
      },
    });
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  },

  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Unauthorized. Refresh token missing.');
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'shivanshrefresh'
      );

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
      });

      if (!user) {
        throw new ApiError(401, 'Invalid refresh token. User not found.');
      }

      if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, 'Refresh token is invalid or has already been consumed.');
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      const loggedInUser = {
        id: user.id,
        firstName: user.firstName,
        secondName: user.secondName,
        email: user.email,
        username: user.username,
        isProfileSetup: user.isProfileSetup,
      };

      return { user: loggedInUser, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ApiError(401, error?.message || 'Invalid or expired refresh token.');
    }
  },
};

export default authService;
