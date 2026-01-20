import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import { recordValidation, validate } from '../middleware/validate.js';
import { database } from '../utils/db.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const router = Router();

// All routes are protected - admin only

// GET all records
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const db = database.getDb();
    const records = await db.collection('records')
      .find({})
      .sort({ date: -1 })
      .toArray();

    res.json(records);
  } catch (error) {
    next(error);
  }
});

// POST create record
router.post('/', verifyToken, recordValidation, validate, async (req: AuthRequest, res, next) => {
  try {
    const { car, issue, solution, cost, revenue } = req.body;

    const record = {
      date: new Date().toLocaleDateString(),
      car,
      issue,
      solution,
      cost: Number(cost),
      revenue: Number(revenue),
      createdAt: new Date()
    };

    const db = database.getDb();
    const result = await db.collection('records').insertOne(record);

    logger.info(`New service record created: ${car} - ${issue}`);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertedId,
        ...record
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE record
router.delete('/', verifyToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new ValidationError('Record ID is required');
    }

    if (!ObjectId.isValid(id)) {
      throw new ValidationError('Invalid record ID');
    }

    const db = database.getDb();
    const result = await db.collection('records').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new NotFoundError('Record not found');
    }

    logger.info(`Record deleted: ${id}`);

    res.json({
      success: true,
      data: { id }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
