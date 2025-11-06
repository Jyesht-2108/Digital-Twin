import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import routes from './routes/index.js';
import { env } from './config/index.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());

// Health check route
app.get('/health', async (req, res, next) => {
  try {
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Default Redis status
    let redisStatus = 'unavailable';

    // Check Redis connection if available
    try {
      // Check if Redis is configured via environment variables
      if (env.REDIS_URL || env.REDIS_HOST) {
        // Create a test connection with timeout
        const redisClient = new Redis(env.REDIS_URL || {
          host: env.REDIS_HOST || 'localhost',
          port: env.REDIS_PORT || 6379,
          connectTimeout: 2000, // 2 second timeout
          maxRetriesPerRequest: 1
        });
        
        try {
          // Try to ping Redis with a timeout
          const pingPromise = redisClient.ping();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Redis connection timeout')), 2000)
          );
          
          await Promise.race([pingPromise, timeoutPromise]);
          redisStatus = 'connected';
          redisClient.disconnect();
        } catch (error) {
          redisStatus = 'unavailable';
          try {
            redisClient.disconnect();
          } catch {
            // Ignore disconnect errors
          }
        }
      }
    } catch (error) {
      // Redis not configured or not available
      redisStatus = 'unavailable';
    }

    // Build response in expected format
    const healthStatus = {
      status: mongoStatus === 'connected' ? 'ok' : 'unhealthy',
      mongo: mongoStatus,
      redis: redisStatus
    };

    // If MongoDB is not connected, return 503
    if (mongoStatus !== 'connected') {
      return res.status(503).json(healthStatus);
    }

    // Send response
    return res.status(200).json(healthStatus);
  } catch (error) {
    // Pass any unexpected errors to error handler
    next(error);
  }
});

// Mount routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const errorResponse = {
    error: err.name || 'Error',
    message: err.message || 'An unexpected error occurred'
  };

  // Log error details in development
  if (env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json(errorResponse);
});

export default app;

