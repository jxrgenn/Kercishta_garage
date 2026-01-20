import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { generateToken } from '../middleware/auth.js';
import { loginValidation, validate } from '../middleware/validate.js';
import { AuthenticationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Strict rate limiting for login - 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: { message: 'Too many login attempts, please try again later', statusCode: 429 } },
  standardHeaders: true,
  legacyHeaders: false
});

// Login endpoint
router.post('/', loginLimiter, loginValidation, validate, async (req, res, next) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      logger.error('ADMIN_PASSWORD not set in environment');
      throw new Error('Server configuration error');
    }

    // Compare passwords
    const isValid = password === adminPassword;

    if (!isValid) {
      logger.warn(`Failed login attempt from IP: ${req.ip}`);
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken({ role: 'admin' });

    logger.info(`Successful login from IP: ${req.ip}`);

    res.json({
      success: true,
      data: {
        token,
        expiresIn: '24h'
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
