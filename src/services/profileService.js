import { prisma } from '../lib/prisma.js';
import ApiError from '../utils/ApiError.js';

export const profileService = {
  async createProfile(userId, profileData) {
    const { age, gender, Weight, Height, FitnessGoal, ExperienceLevel, Injuries, weight, height, fitnessGoal, experienceLevel, injuries } = profileData;

    const finalWeight = String(weight || Weight || '');
    const finalHeight = String(height || Height || '');
    const finalGoal = fitnessGoal || FitnessGoal || '';
    const finalExp = experienceLevel || ExperienceLevel || '';
    const finalInjuries = injuries || Injuries || '';
    const finalAge = String(age || '');
    const finalGender = gender || '';

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        age: finalAge,
        gender: finalGender,
        weight: finalWeight,
        height: finalHeight,
        fitnessGoal: finalGoal,
        experienceLevel: finalExp,
        injuries: finalInjuries,
        isProfileSetup: true,
      },
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
        updatedAt: true,
      },
    });

    return user;
  },

  async getProfile(userId) {
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
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }

    return user;
  },

  async updateProfile(userId, updateData) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, 'User not found');

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: updateData.username || user.username,
        email: updateData.email ? updateData.email.toLowerCase() : user.email,
        firstName: updateData.firstName !== undefined ? updateData.firstName : user.firstName,
        secondName: updateData.secondName !== undefined ? updateData.secondName : user.secondName,
        age: updateData.age !== undefined ? String(updateData.age) : user.age,
        gender: updateData.gender || user.gender,
        weight: updateData.weight !== undefined ? String(updateData.weight) : (updateData.Weight !== undefined ? String(updateData.Weight) : user.weight),
        height: updateData.height !== undefined ? String(updateData.height) : (updateData.Height !== undefined ? String(updateData.Height) : user.height),
        fitnessGoal: updateData.fitnessGoal || updateData.FitnessGoal || user.fitnessGoal,
        experienceLevel: updateData.experienceLevel || updateData.ExperienceLevel || user.experienceLevel,
        injuries: updateData.injuries !== undefined ? updateData.injuries : (updateData.Injuries !== undefined ? updateData.Injuries : user.injuries),
        isProfileSetup: true,
      },
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
        updatedAt: true,
      },
    });

    return updatedUser;
  },
};

export default profileService;
