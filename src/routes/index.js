import express from 'express';
import authRoutes from './authRoutes/auth.routes.js'
import userRoutes from './profileRoutes/profile.routes.js'
import workoutRoutes from './workoutRoutes/workout.routes.js'
import workoutLogRoutes from './workoutLogRoutes/workout.log.routes.js'
const router = express.Router()

router.use('/auth', authRoutes)
router.use('/profile', userRoutes)
router.use('/workout',workoutRoutes)
router.use('/workout-logs',workoutLogRoutes)


export default router;