import { Router } from 'express';
import { logRecovery, getRecoveryHistory, getRecoveryStats } from '../controllers/recovery.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { recoverySchema } from '../validators/recovery.validator.js';

const router = Router();

router.use(verifyJWT);

router.post('/', validate(recoverySchema), logRecovery);
router.get('/', getRecoveryHistory);
router.get('/stats', getRecoveryStats);

export default router;
