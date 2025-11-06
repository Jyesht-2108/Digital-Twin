import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Export environment variables
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  // Add other environment variables as needed
  ...process.env
};

export default env;

