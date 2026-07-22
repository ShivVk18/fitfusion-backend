import { Router } from 'express';
import {
  getOverview,
  getWorkoutsAnalytics,
  getProgressAnalytics,
  getRecoveryAnalytics,
} from '../controllers/analytics.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.get('/overview', getOverview);
router.get('/workouts', getWorkoutsAnalytics);
router.get('/progress', getProgressAnalytics);
router.get('/recovery', getRecoveryAnalytics);

export default router;
