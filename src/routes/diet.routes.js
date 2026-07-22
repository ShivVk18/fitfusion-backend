import { Router } from 'express';
import { createDiet, getDiet, updateDiet, deleteDiet } from '../controllers/diet.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { dietSchema } from '../validators/diet.validator.js';

const router = Router();

router.use(verifyJWT);

router.post('/', validate(dietSchema), createDiet);
router.get('/', getDiet);
router.put('/:id', updateDiet);
router.delete('/:id', deleteDiet);

export default router;
