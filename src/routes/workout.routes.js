import { Router } from 'express';
import {
  generateWorkoutPlanController,
  getWorkoutPlans,
  getWorkoutPlanById,
  deleteWorkoutPlan,
} from '../controllers/workout.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { generateWorkoutSchema } from '../validators/workout.validator.js';

const router = Router();

router.use(verifyJWT);

router.post('/generate', validate(generateWorkoutSchema), generateWorkoutPlanController);
router.get('/', getWorkoutPlans);
router.get('/:planId', getWorkoutPlanById);
router.delete('/:planId', deleteWorkoutPlan);

export default router;
