import { Router } from 'express';
import { ObjectId } from 'mongodb';
import rateLimit from 'express-rate-limit';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import { leadValidation, statusUpdateValidation, validate } from '../middleware/validate.js';
import { database } from '../utils/db.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Rate limiting for public lead submission - 3 per hour per IP
const submitLeadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, error: { message: 'Too many submissions, please try again later', statusCode: 429 } },
  standardHeaders: true,
  legacyHeaders: false
});

// GET all leads (protected)
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const db = database.getDb();
    const leads = await db.collection('leads')
      .find({})
      .sort({ date: -1 })
      .toArray();

    res.json(leads);
  } catch (error) {
    next(error);
  }
});

// POST create lead (public, rate-limited)
router.post('/', submitLeadLimiter, leadValidation, validate, async (req, res, next) => {
  try {
    const { name, phone, car, issue } = req.body;

    const lead = {
      date: new Date().toLocaleDateString(),
      name,
      phone,
      car,
      issue: issue || '',
      status: 'new' as const,
      createdAt: new Date()
    };

    const db = database.getDb();
    const result = await db.collection('leads').insertOne(lead);

    logger.info(`New lead submitted: ${name} - ${car}`);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertedId,
        ...lead
      }
    });
  } catch (error) {
    next(error);
  }
});

// PATCH update lead status (protected)
router.patch('/', verifyToken, statusUpdateValidation, validate, async (req: AuthRequest, res, next) => {
  try {
    const { id, status } = req.body;

    if (!ObjectId.isValid(id)) {
      throw new ValidationError('Invalid lead ID');
    }

    const db = database.getDb();
    const result = await db.collection('leads').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      throw new NotFoundError('Lead not found');
    }

    logger.info(`Lead ${id} status updated to: ${status}`);

    res.json({
      success: true,
      data: { id, status }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE lead (protected)
router.delete('/', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Lead ID is required');
    }

    if (!ObjectId.isValid(id)) {
      throw new ValidationError('Invalid lead ID');
    }

    const db = database.getDb();
    const result = await db.collection('leads').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new NotFoundError('Lead not found');
    }

    logger.info(`Lead deleted: ${id}`);

    res.json({
      success: true,
      data: { id }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
