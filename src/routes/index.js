import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import workoutRoutes from './workout.routes.js';
import workoutLogRoutes from './workoutLog.routes.js';
import progressRoutes from './progress.routes.js';
import dietRoutes from './diet.routes.js';
import recoveryRoutes from './recovery.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import analyticsRoutes from './analytics.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/workout', workoutRoutes);
router.use('/workout-log', workoutLogRoutes);
router.use('/progress', progressRoutes);
router.use('/diet', dietRoutes);
router.use('/recovery', recoveryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);

export default router;