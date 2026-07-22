import { GoogleGenAI } from '@google/genai';
import { prisma } from '../lib/prisma.js';
import logger from '../utils/logger.js';
import {
  SYSTEM_INSTRUCTION,
  workoutPlanPrompt,
  progressAnalysisPrompt,
  dietPlanPrompt,
  recoveryAdvicePrompt,
  aiChatPrompt,
} from './prompts.js';

const callGeminiJson = async (promptText) => {
  const ai = new GoogleGenAI({});

  try {
    const interaction = await ai.interactions.create({
      model: 'gemini-3.5-flash',
      input: `${SYSTEM_INSTRUCTION}\n\n${promptText}`,
    });

    const rawText = interaction.output_text || '';
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText);
  } catch (err) {
    logger.warn(`ai.interactions.create with gemini-3.5-flash failed, trying fallback: ${err.message}`);

    // Fallback: models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const rawText = response.text || '';
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  }
};

const saveAiHistory = async (userId, requestType, prompt, requestData, responseData) => {
  try {
    await prisma.aIHistory.create({
      data: {
        userId,
        requestType,
        prompt: prompt.slice(0, 1000),
        requestData: requestData || {},
        responseData: responseData || {},
      },
    });
  } catch (err) {
    logger.error('Failed to record AIHistory log:', err);
  }
};

export const aiService = {
  async generateWorkoutPlan(userId, userProfile, daysPerWeek = 4) {
    const prompt = workoutPlanPrompt(userProfile, daysPerWeek);
    logger.ai('WORKOUT_PLAN', prompt, { userId, daysPerWeek });

    let result;
    try {
      result = await callGeminiJson(prompt);
    } catch (err) {
      logger.error('Gemini Workout Plan fallback triggered due to API error:', err.message);
      result = {
        plan_name: `${userProfile.fitnessGoal || 'Strength'} Core Protocol`,
        split_type: daysPerWeek > 3 ? 'Upper-Lower' : 'Full Body',
        duration: '4 weeks',
        days: Array.from({ length: daysPerWeek }).map((_, i) => ({
          day: `Day ${i + 1} - ${i % 2 === 0 ? 'Upper Body Focus' : 'Lower Body & Core'}`,
          focus: i % 2 === 0 ? 'Hypertrophy' : 'Strength',
          exercises: [
            { name: i % 2 === 0 ? 'Barbell Bench Press' : 'Barbell Back Squat', sets: '4', reps: '8-10', rest: '90s' },
            { name: i % 2 === 0 ? 'Bent-Over Dumbbell Row' : 'Romanian Deadlift', sets: '3', reps: '10-12', rest: '60s' },
            { name: i % 2 === 0 ? 'Overhead Shoulder Press' : 'Walking Lunges', sets: '3', reps: '12', rest: '60s' },
          ],
        })),
      };
    }

    await saveAiHistory(userId, 'WORKOUT_PLAN', prompt, { daysPerWeek }, result);
    return result;
  },

  async analyzeProgress(userId, userProfile, progressStats, recentLogs) {
    const prompt = progressAnalysisPrompt(userProfile, progressStats, recentLogs);
    logger.ai('PROGRESS_ANALYSIS', prompt, { userId });

    let result;
    try {
      result = await callGeminiJson(prompt);
    } catch (err) {
      logger.error('Gemini Progress Analysis fallback triggered due to API error:', err.message);
      result = {
        summary: `Current weight trend is ${progressStats.weightTrend}. Progress is tracking regularly.`,
        plateauAnalysis: progressStats.plateau ? 'Weight metrics show minimal fluctuation. Recommend adjusting volume.' : 'No plateau detected.',
        actionableTips: [
          'Maintain daily protein target relative to body mass.',
          'Focus on progressive overload by increasing weight or reps weekly.',
        ],
        recommendedAdjustments: {
          workout: 'Add 1 additional set to compound lifts',
          nutrition: 'Increase daily protein intake by 10g',
        },
      };
    }

    await saveAiHistory(userId, 'PROGRESS_ANALYSIS', prompt, { progressStats }, result);
    return result;
  },

  async generateDietPlan(userId, userProfile, dietPreferences) {
    const prompt = dietPlanPrompt(userProfile, dietPreferences);
    logger.ai('DIET_PLAN', prompt, { userId });

    let result;
    try {
      result = await callGeminiJson(prompt);
    } catch (err) {
      logger.error('Gemini Diet Plan fallback triggered due to API error:', err.message);
      result = {
        calories: '2400',
        protein: '165g',
        carbs: '250g',
        fats: '70g',
        dietType: dietPreferences?.dietType || 'Balanced High Protein',
        goal: userProfile.fitnessGoal || 'Muscle Growth',
        meals: [
          { name: 'Breakfast', time: '08:00 AM', items: ['4 Egg Whites + 2 Whole Eggs', '1 Cup Oatmeal', '1 Banana'], calories: '550', protein: '38g' },
          { name: 'Lunch', time: '01:00 PM', items: ['200g Grilled Chicken Breast', '1.5 Cups Jasmine Rice', 'Steamed Broccoli'], calories: '650', protein: '52g' },
          { name: 'Pre-Workout Snack', time: '04:30 PM', items: ['1 Scoop Whey Protein', '1 Apple', '15g Almonds'], calories: '300', protein: '28g' },
          { name: 'Dinner', time: '08:00 PM', items: ['200g Lean Beef / Salmon', 'Roasted Sweet Potato', 'Mixed Salad'], calories: '650', protein: '45g' },
        ],
      };
    }

    await saveAiHistory(userId, 'DIET_PLAN', prompt, { dietPreferences }, result);
    return result;
  },

  async generateRecoveryAdvice(userId, userProfile, recoveryMetrics) {
    const prompt = recoveryAdvicePrompt(userProfile, recoveryMetrics);
    logger.ai('RECOVERY_ADVICE', prompt, { userId });

    let result;
    try {
      result = await callGeminiJson(prompt);
    } catch (err) {
      logger.error('Gemini Recovery Advice fallback triggered due to API error:', err.message);
      result = {
        recoveryScoreCategory: recoveryMetrics.latestScore >= 75 ? 'Optimal' : 'Needs Attention',
        readinessStatus: recoveryMetrics.latestScore >= 70 ? 'High intensity training ready' : 'Active recovery & light session recommended',
        sleepAdvice: 'Aim for 7.5 - 8.5 hours of uninterrupted sleep in a dark, cool room.',
        nutritionAdvice: 'Drink at least 3 Liters of water daily and take electrolyte minerals post-workout.',
        recommendations: [
          'Perform 10-15 minutes of light foam rolling before bedtime.',
          'Keep hydration consistent throughout the day.',
        ],
      };
    }

    await saveAiHistory(userId, 'RECOVERY_ADVICE', prompt, { recoveryMetrics }, result);
    return result;
  },

  async chat(userId, userProfile, contextData, userMessage) {
    const prompt = aiChatPrompt(userProfile, contextData, userMessage);
    logger.ai('CHAT', prompt, { userId, userMessage });

    let result;
    try {
      result = await callGeminiJson(prompt);
    } catch (err) {
      logger.error('Gemini Chat fallback triggered due to API error:', err.message);
      result = {
        reply: `Hello! I reviewed your question about "${userMessage}". For optimal results, ensure your training volume matches your nutrition intake and prioritize 7-8 hours of sleep.`,
        suggestedActions: ['Track today\'s workout log', 'Log daily hydration level'],
      };
    }

    await saveAiHistory(userId, 'CHAT', prompt, { userMessage, contextData }, result);
    return result;
  },

  async getAiHistory(userId) {
    return await prisma.aIHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  },
};

export default aiService;
