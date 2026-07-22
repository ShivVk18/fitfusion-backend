import { Router } from 'express';
import { addProgress, getProgress, getProgressStats } from '../controllers/progress.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.post('/', addProgress);
router.get('/', getProgress);
router.get('/stats', getProgressStats);

export default router;
