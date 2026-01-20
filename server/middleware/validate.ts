import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new ValidationError(errorMessages));
  }
  next();
};

// Lead validation rules
export const leadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^\+?[\d\s\-()]+$/).withMessage('Invalid phone format'),

  body('car')
    .trim()
    .notEmpty().withMessage('Car is required')
    .isLength({ min: 3, max: 100 }).withMessage('Car must be between 3-100 characters'),

  body('issue')
    .trim()
    .optional()
    .isLength({ max: 1000 }).withMessage('Issue must be less than 1000 characters')
];

// Record validation rules
export const recordValidation = [
  body('car')
    .trim()
    .notEmpty().withMessage('Car is required')
    .isLength({ min: 3, max: 100 }).withMessage('Car must be between 3-100 characters'),

  body('issue')
    .trim()
    .notEmpty().withMessage('Issue is required')
    .isLength({ min: 3, max: 500 }).withMessage('Issue must be between 3-500 characters'),

  body('solution')
    .trim()
    .notEmpty().withMessage('Solution is required')
    .isLength({ min: 3, max: 500 }).withMessage('Solution must be between 3-500 characters'),

  body('cost')
    .isFloat({ min: 0, max: 100000 }).withMessage('Cost must be between 0-100000'),

  body('revenue')
    .isFloat({ min: 0, max: 100000 }).withMessage('Revenue must be between 0-100000')
];

// Login validation
export const loginValidation = [
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 4 }).withMessage('Password must be at least 4 characters')
];

// Lead status update validation
export const statusUpdateValidation = [
  body('id')
    .trim()
    .notEmpty().withMessage('Lead ID is required'),

  body('status')
    .isIn(['new', 'contacted', 'resolved']).withMessage('Invalid status')
];
