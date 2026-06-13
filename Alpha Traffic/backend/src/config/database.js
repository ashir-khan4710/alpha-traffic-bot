const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saas-dashboard';

/**
 * Connect to MongoDB
 * @returns {Promise} Connection promise
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`
    ╔════════════════════════════════════════╗
    ║    MONGODB CONNECTION ESTABLISHED      ║
    ╠════════════════════════════════════════╣
    ║ Host: ${conn.connection.host.padEnd(32)}║
    ║ DB:   ${conn.connection.name.padEnd(32)}║
    ╚════════════════════════════════════════╝
    `);

    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
    process.exit(1);
  }
};

/**
 * Get connection status
 */
const getConnectionStatus = () => {
  return {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    db: mongoose.connection.name
  };
};

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus
};
