import mongoose from 'mongoose';
import winston from 'winston';
import { env } from './index.js';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export async function connectDB() {
  try {
    if (!env.MONGO_URL) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }

    // Mongoose 6+ handles URL parsing and topology automatically
    // No need for deprecated useNewUrlParser and useUnifiedTopology options
    await mongoose.connect(env.MONGO_URL);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

export default connectDB;

