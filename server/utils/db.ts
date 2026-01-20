import { MongoClient, Db } from 'mongodb';
import { logger } from './logger.js';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'kercishta';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

class Database {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connecting: Promise<void> | null = null;

  async connect(): Promise<Db> {
    // Return existing connection
    if (this.db) {
      return this.db;
    }

    // Wait for existing connection attempt
    if (this.connecting) {
      await this.connecting;
      return this.db!;
    }

    // Create new connection
    this.connecting = this._connect();
    await this.connecting;
    this.connecting = null;
    return this.db!;
  }

  private async _connect(): Promise<void> {
    try {
      logger.info('Connecting to MongoDB...');

      this.client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 60000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      await this.client.connect();

      // Verify connection
      await this.client.db('admin').command({ ping: 1 });

      this.db = this.client.db(DB_NAME);

      logger.info(`Connected to MongoDB database: ${DB_NAME}`);

      // Setup indexes
      await this.setupIndexes();

      // Handle connection events
      this.client.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
      });

      this.client.on('close', () => {
        logger.warn('MongoDB connection closed');
        this.db = null;
        this.client = null;
      });

    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      this.db = null;
      this.client = null;
      throw error;
    }
  }

  private async setupIndexes(): Promise<void> {
    if (!this.db) return;

    try {
      // Leads indexes
      await this.db.collection('leads').createIndex({ status: 1 });
      await this.db.collection('leads').createIndex({ date: -1 });

      // Records indexes
      await this.db.collection('records').createIndex({ date: -1 });

      logger.info('Database indexes created successfully');
    } catch (error) {
      logger.error('Error creating indexes:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      logger.info('Disconnected from MongoDB');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
}

// Singleton instance
export const database = new Database();

// Graceful shutdown
process.on('SIGINT', async () => {
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await database.disconnect();
  process.exit(0);
});
