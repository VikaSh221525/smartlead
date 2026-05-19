import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { handleValidationErrors } from '../middleware/validate';

const router = Router();

// Public routes
router.post('/register', registerValidator, handleValidationErrors, register);
router.post('/login', loginValidator, handleValidationErrors, login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
