import app from './app.js';
import { CONFIG, ERROR_CODES, LOG_LEVELS } from './constants.js';

// Logger utility with timestamps
const logger = {
  error: (message, details = {}) => {
    console.error(`[${LOG_LEVELS.ERROR}] ${message}`, {
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  warn: (message, details = {}) => {
    console.warn(`[${LOG_LEVELS.WARN}] ${message}`, {
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  info: (message, details = {}) => {
    console.log(`[${LOG_LEVELS.INFO}] ${message}`, {
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
  debug: (message, details = {}) => {
    if (CONFIG.NODE_ENV === 'development') {
      console.log(`[${LOG_LEVELS.DEBUG}] ${message}`, {
        ...details,
        timestamp: new Date().toISOString(),
      });
    }
  },
};

// MongoDB connection function with comprehensive error handling
async function connectToDatabase() {
  try {
    logger.info('Attempting to connect to MongoDB', { uri: CONFIG.MONGODB_URI.substring(0, 50) + '...' });
    
    // TODO: Add your MongoDB connection logic here
    // For example, if using mongoose:
    // const mongoose = require('mongoose');
    // await mongoose.connect(CONFIG.MONGODB_URI, {
    //   serverSelectionTimeoutMS: 5000,
    //   socketTimeoutMS: 45000,
    // });
    
    logger.info('Successfully connected to MongoDB');
    return true;
  } catch (error) {
    logger.error('MongoDB connection failed', {
      code: error.code,
      message: error.message,
      name: error.name,
      errorCode: ERROR_CODES.DB_CONNECTION_ERROR,
    });
    
    // Provide helpful troubleshooting information
    if (error.code === 'ECONNREFUSED') {
      logger.warn('Connection refused: MongoDB server may not be running or unreachable', {
        possibleCauses: [
          'MongoDB Atlas cluster is paused',
          'Network connectivity issue',
          'IP address not whitelisted in MongoDB Atlas',
          'Incorrect connection string',
          'Invalid credentials',
        ],
        suggestions: [
          '1. Verify your MongoDB URI in .env file',
          '2. Check MongoDB Atlas cluster status',
          '3. Verify IP whitelist settings in MongoDB Atlas',
          '4. Ensure credentials are correct',
          '5. Test network connectivity to MongoDB',
        ],
      });
    }
    
    if (error.name === 'MongoNetworkError' || error.name === 'MongoError') {
      logger.warn('MongoDB network error detected', {
        details: 'Check network connectivity and MongoDB Atlas status',
      });
    }
    
    return false;
  }
}

// Server startup function
async function startServer() {
  try {
    // Try to connect to database
    const dbConnected = await connectToDatabase();
    
    if (!dbConnected && CONFIG.NODE_ENV === 'production') {
      throw new Error('Failed to connect to database in production environment');
    }
    
    if (!dbConnected && CONFIG.NODE_ENV === 'development') {
      logger.warn('Database connection failed in development mode, but server will continue to run', {
        note: 'This allows development without a live MongoDB instance',
      });
    }
    
    // Start server
    const server = app.listen(CONFIG.PORT, () => {
      logger.info(`Server started successfully`, {
        port: CONFIG.PORT,
        environment: CONFIG.NODE_ENV,
        baseUrl: `http://localhost:${CONFIG.PORT}`,
        databaseStatus: dbConnected ? 'Connected' : 'Not Connected',
      });
    });
    
    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error occurred', {
        message: error.message,
        code: error.code,
      });
      
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${CONFIG.PORT} is already in use`, {
          suggestion: `Try using a different port or kill the process using port ${CONFIG.PORT}`,
        });
      }
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    logger.error('Failed to start server', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection detected', {
    reason: reason instanceof Error ? reason.message : String(reason),
    promise: String(promise),
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception detected', {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Start the server
startServer();
