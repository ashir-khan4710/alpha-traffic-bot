# SaaS Dashboard - Backend

Production-ready SaaS dashboard backend with Express.js, MongoDB, Socket.io, and JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MongoDB 5.0+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Or production server
npm start
```

## 📁 Project Structure

```
src/
├── config/          # Configuration (database, env vars)
├── models/          # Mongoose schemas
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth, error handling
├── services/        # Session, proxy, bot, socket managers
├── utils/           # JWT, event emitters
├── app.js          # Express setup
└── server.js       # Server startup
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Profiles
- `GET /api/profiles` - Get user profile
- `PUT /api/profiles` - Update profile
- `PUT /api/profiles/preferences` - Update preferences

### Proxies
- `POST /api/proxies` - Create proxy
- `GET /api/proxies` - List proxies
- `PUT /api/proxies/:proxyId` - Update proxy
- `DELETE /api/proxies/:proxyId` - Delete proxy
- `POST /api/proxies/:proxyId/verify` - Verify proxy

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions` - List sessions
- `POST /api/sessions/:sessionId/start` - Start session
- `POST /api/sessions/:sessionId/end` - End session
- `POST /api/sessions/:sessionId/pause` - Pause session
- `POST /api/sessions/:sessionId/resume` - Resume session

### Logs
- `POST /api/logs` - Create log
- `GET /api/logs` - List logs
- `GET /api/logs/statistics` - Get statistics

### Real-time
- `GET /api/realtime/dashboard/stats` - Dashboard stats
- `GET /api/realtime/logs/recent` - Recent logs
- `GET /api/realtime/proxies/metrics` - Proxy metrics

## 🔌 Socket.io Events

### Listen for:
- `session:started` - Session begins
- `session:ended` - Session completes
- `session:action_executed` - Action results
- `log:live` - New log entry
- `dashboard:stats` - Dashboard update
- `metrics:update` - Metrics broadcast

### Emit:
- `session:start` - Start session
- `session:end` - End session
- `session:action` - Record action
- `log:create` - Create log
- `ping` - Keepalive

## 🗄️ Database Models

**User**
- Authentication & profile info
- Roles: user, admin, moderator

**Profile**
- User preferences & settings
- Subscription status
- Limits & quotas

**Proxy**
- Proxy configuration
- Performance metrics
- Health status

**Session**
- Session lifecycle
- Action tracking
- Performance data

**Log**
- Activity logging
- Configurable retention
- 30-day TTL

## 📊 Features

✅ User authentication (JWT)
✅ Role-based access control
✅ Real-time updates (Socket.io)
✅ Proxy management & verification (simulated)
✅ Session lifecycle management
✅ Activity logging with auto-cleanup
✅ Performance metrics aggregation
✅ Error handling & validation
✅ CORS & security middleware
✅ Graceful shutdown

## 🔐 Security

- Password hashing: bcryptjs (10 rounds)
- JWT expiry: 7 days
- CORS protection
- No sensitive data in logs
- Input validation
- Rate limiting ready

## 📜 Scripts

```bash
npm start         # Production server
npm run dev       # Development (nodemon)
npm run dev:debug # Debug mode
npm test          # Run tests
npm run lint      # ESLint check
npm run seed      # Seed database
```

## 🌍 Environment Variables

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saas-dashboard
JWT_SECRET=your-secret-key-min-32-chars
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

## 📚 Documentation

- [API Documentation](./STRUCTURE.md)
- [Setup Guide](./SETUP.md)
- [Contributing](./CONTRIBUTING.md)

## 📄 License

MIT

## ✨ Notes

- This project uses simulated proxy verification (not real)
- Bot engine simulates automation only (no harmful actions)
- Ready for production deployment
- Fully modular and scalable architecture
