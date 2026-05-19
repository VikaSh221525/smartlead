import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth';
import {
  createLeadValidator,
  updateLeadValidator,
  getLeadsValidator,
  leadIdValidator,
} from '../validators/lead.validator';
import { handleValidationErrors } from '../middleware/validate';
import { UserRole } from '../types';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// Stats (admin only) — must be before /:id to avoid conflict
router.get('/stats', authorize(UserRole.ADMIN), getLeadStats);

// CSV export — supports same filters as list
router.get('/export/csv', getLeadsValidator, handleValidationErrors, exportLeadsCSV);

// CRUD
router.get('/', getLeadsValidator, handleValidationErrors, getLeads);
router.post('/', createLeadValidator, handleValidationErrors, createLead);
router.get('/:id', leadIdValidator, handleValidationErrors, getLeadById);
router.patch('/:id', updateLeadValidator, handleValidationErrors, updateLead);
router.delete('/:id', leadIdValidator, handleValidationErrors, deleteLead);

export default router;
