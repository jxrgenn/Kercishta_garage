
import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './lib/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db('kercishta');
  const collection = db.collection('records');

  const authHeader = req.headers.authorization;
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_PASSWORD}`;

  if (!isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const records = await collection.find({}).sort({ date: -1 }).toArray();
    return res.status(200).json(records);
  }

  if (req.method === 'POST') {
    await collection.insertOne(req.body);
    return res.status(201).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await collection.deleteOne({ _id: new ObjectId(id as string) });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
