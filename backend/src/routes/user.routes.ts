import { Router } from 'express';
import { getUsers, getUserById, deleteUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import { param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validate';

const router = Router();

const mongoIdValidator = [
  param('id').isMongoId().withMessage('Invalid user ID.'),
  handleValidationErrors,
];

router.use(authenticate);

// Admin-only
router.get('/', authorize(UserRole.ADMIN), getUsers);
router.get('/:id', authorize(UserRole.ADMIN), mongoIdValidator, getUserById);
router.delete('/:id', authorize(UserRole.ADMIN), mongoIdValidator, deleteUser);

export default router;
