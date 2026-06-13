const app = require('./app');
const { connectDB, disconnectDB } = require('./config/database');
const { initializeSocket } = require('./services/socketManager');
const config = require('./config');
require('dotenv').config();

const PORT = config.server.port;
const HOST = config.server.host;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    const server = app.listen(PORT, HOST, () => {
      console.log(`
  ╔════════════════════════════════════════╗
  ║     SaaS DASHBOARD SERVER STARTED      ║
  ╠════════════════════════════════════════╣
  ║ Host:        ${HOST.padEnd(32)}║
  ║ Port:        ${PORT.toString().padEnd(32)}║
  ║ Environment: ${config.server.env.padEnd(32)}║
  ╚════════════════════════════════════════╝
  `);
    });

    // Initialize Socket.io for real-time features
    const io = initializeSocket(server, config);
    app.set('io', io);

    console.log('[Socket.io] Real-time system initialized');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      
      // Disconnect all socket clients
      io.disconnectSockets();
      
      server.close(async () => {
        await disconnectDB();
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully...');
      
      // Disconnect all socket clients
      io.disconnectSockets();
      
      server.close(async () => {
        await disconnectDB();
        console.log('Server closed');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

module.exports = startServer;
