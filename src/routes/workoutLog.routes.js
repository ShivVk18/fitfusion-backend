import { Router } from 'express';
import {
  logWorkoutController,
  getWorkoutLogsController,
  getWorkoutLogByIdController,
  deleteWorkoutLogController,
} from '../controllers/workout.log.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { logWorkoutSchema } from '../validators/workout.validator.js';

const router = Router();

router.use(verifyJWT);

router.post('/', validate(logWorkoutSchema), logWorkoutController);
router.get('/', getWorkoutLogsController);
router.get('/:logId', getWorkoutLogByIdController);
router.delete('/:logId', deleteWorkoutLogController);

export default router;
