import { Router } from 'express';
import {
  generateWorkoutPlan,
  analyzeProgress,
  generateDietPlan,
  generateRecoveryAdvice,
  handleAiChat,
  getAiHistory,
} from '../controllers/ai.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.post('/workout-plan', generateWorkoutPlan);
router.post('/progress-analysis', analyzeProgress);
router.post('/diet-plan', generateDietPlan);
router.post('/recovery-advice', generateRecoveryAdvice);
router.post('/chat', handleAiChat);
router.get('/history', getAiHistory);

export default router;
