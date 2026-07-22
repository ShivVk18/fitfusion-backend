import { Router } from 'express';
import { userSignUp, userSignIn, userSignOut, getCurrentUser, refreshAccessToken } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { signUpSchema, signInSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/signup', validate(signUpSchema), userSignUp);
router.post('/login', validate(signInSchema), userSignIn);
router.post('/logout', verifyJWT, userSignOut);
router.get('/me', verifyJWT, getCurrentUser);
router.post('/refresh', refreshAccessToken);

export default router;
