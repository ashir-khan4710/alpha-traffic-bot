require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 5000,
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production'
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/saas-dashboard',
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'debug'
  }
};

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['JWT_SECRET'];
  
  if (config.server.isProd) {
    requiredVars.push('MONGODB_URI');
  }

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
  }

  return {
    isValid: true,
    missing
  };
};

module.exports = {
  ...config,
  validateConfig
};
