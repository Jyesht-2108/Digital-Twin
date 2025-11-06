import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/index.js';

const PORT = env.PORT || 3000;

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

