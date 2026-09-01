// Configuration and constants
export const CONFIG = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://cluster0.yp6j6x1.mongodb.net/database_name?retryWrites=true&w=majority',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const ERROR_CODES = {
  DB_CONNECTION_ERROR: 'MONGODB_CONNECTION_ERROR',
  QUERY_ERROR: 'QUERY_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
};

export const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};
