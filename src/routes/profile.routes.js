import { Router } from 'express';
import { createProfile, getProfile, updateProfile } from '../controllers/profile.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { profileSchema } from '../validators/profile.validator.js';

const router = Router();

router.use(verifyJWT);

router.post('/', validate(profileSchema), createProfile);
router.get('/', getProfile);
router.put('/', validate(profileSchema), updateProfile);

export default router;
