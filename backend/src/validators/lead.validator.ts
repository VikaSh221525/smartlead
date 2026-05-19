import { body, query, param } from 'express-validator';
import { LeadStatus, LeadSource, SortOrder } from '../types';

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email.')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}.`),

  body('source')
    .notEmpty().withMessage('Source is required.')
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}.`),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters.'),

  body('assignedTo')
    .optional()
    .isMongoId().withMessage('assignedTo must be a valid user ID.'),
];

export const updateLeadValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID.'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email.')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}.`),

  body('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}.`),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters.'),

  body('assignedTo')
    .optional()
    .isMongoId().withMessage('assignedTo must be a valid user ID.'),
];

export const getLeadsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer.'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),

  query('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}.`),

  query('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}.`),

  query('sort')
    .optional()
    .isIn(Object.values(SortOrder))
    .withMessage(`Sort must be one of: ${Object.values(SortOrder).join(', ')}.`),
];

export const leadIdValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID.'),
];
