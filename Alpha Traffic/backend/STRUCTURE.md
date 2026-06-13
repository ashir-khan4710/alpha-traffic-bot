# Project Structure Documentation

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── index.js              # Centralized configuration
│   │
│   ├── models/
│   │   ├── User.js               # User model with auth
│   │   ├── Profile.js            # User profile model
│   │   ├── Proxy.js              # Proxy configuration model
│   │   ├── Session.js            # Session/bot session model
│   │   ├── Log.js                # Activity logging model
│   │   └── index.js              # Model exports
│   │
│   ├── controllers/
│   │   ├── authController.js     # Auth (login, register, refresh)
│   │   ├── profileController.js  # Profile CRUD
│   │   ├── proxyController.js    # Proxy CRUD & verification
│   │   ├── sessionController.js  # Session CRUD & management
│   │   ├── logController.js      # Log retrieval & filtering
│   │   └── realtimeController.js # Real-time data endpoints
│   │
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   ├── profiles.js           # Profile endpoints
│   │   ├── proxies.js            # Proxy endpoints
│   │   ├── sessions.js           # Session endpoints
│   │   ├── logs.js               # Log endpoints
│   │   └── realtime.js           # Real-time endpoints
│   │
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication & authorization
│   │   ├── errorHandler.js       # Error handling & validation
│   │   └── index.js              # Middleware exports
│   │
│   ├── services/
│   │   ├── sessionManager.js     # Session lifecycle management
│   │   ├── proxyManager.js       # Proxy management & health
│   │   ├── botEngine.js          # Bot simulation (safe)
│   │   ├── socketManager.js      # Socket.io real-time events
│   │   └── index.js              # Service exports
│   │
│   ├── utils/
│   │   ├── jwt.js                # JWT token utilities
│   │   └── eventEmitter.js       # Socket.io event helpers
│   │
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server startup & shutdown
│
├── .env.development              # Dev environment variables
├── .env.production               # Prod environment variables
├── .env.example                  # Example env file
├── package.json                  # Dependencies & scripts
└── README.md                     # Backend documentation

## Frontend Structure

```
frontend/
├── index.html                    # Main HTML template
├── index.css                     # Styling (responsive)
├── index.js                      # Application logic
└── README.md                     # Frontend documentation

## API Endpoints

### Authentication
- POST /api/auth/register         # Register new user
- POST /api/auth/login            # Login user
- POST /api/auth/refresh          # Refresh token
- GET  /api/auth/me               # Get current user
- POST /api/auth/logout           # Logout

### Profiles
- GET  /api/profiles              # Get user profile
- PUT  /api/profiles              # Update profile
- PUT  /api/profiles/preferences  # Update preferences
- GET  /api/profiles/all          # Get all profiles (admin)
- PUT  /api/profiles/:userId/status # Update status (admin)
- DELETE /api/profiles/:userId    # Delete profile (admin)

### Proxies
- POST /api/proxies               # Create proxy
- GET  /api/proxies               # List user proxies
- GET  /api/proxies/:proxyId      # Get proxy details
- PUT  /api/proxies/:proxyId      # Update proxy
- DELETE /api/proxies/:proxyId    # Delete proxy
- POST /api/proxies/:proxyId/verify # Verify proxy
- POST /api/proxies/bulk/status   # Bulk update status

### Sessions
- POST /api/sessions              # Create session
- GET  /api/sessions              # List sessions
- GET  /api/sessions/:sessionId   # Get session
- POST /api/sessions/:sessionId/start # Start session
- POST /api/sessions/:sessionId/end   # End session
- POST /api/sessions/:sessionId/pause # Pause session
- POST /api/sessions/:sessionId/resume # Resume session
- POST /api/sessions/:sessionId/actions # Add action
- PUT  /api/sessions/:sessionId   # Update session
- DELETE /api/sessions/:sessionId # Delete session

### Logs
- POST /api/logs                  # Create log
- GET  /api/logs                  # List logs with filters
- GET  /api/logs/statistics       # Get statistics
- GET  /api/logs/:logId           # Get single log
- GET  /api/logs/session/:sessionId # Get session logs
- POST /api/logs/cleanup/old      # Delete old logs
- DELETE /api/logs/session/:sessionId # Clear session logs

### Real-time
- GET  /api/realtime/dashboard/stats     # Dashboard statistics
- GET  /api/realtime/sessions/:sessionId/updates # Session updates
- GET  /api/realtime/logs/recent        # Recent logs
- GET  /api/realtime/proxies/metrics    # Proxy metrics
- POST /api/realtime/metrics/broadcast  # Broadcast metrics

## Database Models

### User
- email (unique, indexed)
- username (unique, indexed)
- password (hashed)
- firstName, lastName
- role (user, admin, moderator)
- isActive, lastLogin
- timestamps

### Profile
- userId (reference to User, unique)
- bio, company, location, website
- preferences (theme, notifications)
- sessionLimit, proxyLimit
- accountStatus (active, suspended, trial, premium)
- subscriptionExpiry

### Proxy
- userId (reference to User)
- name, protocol, host, port
- username, password (auth)
- isActive, status
- performance metrics (success rate, avg response time)
- failureCount, lastVerified
- location data

### Session
- userId (reference to User)
- proxyId (optional, reference to Proxy)
- name, status (pending, active, paused, completed)
- sessionType (manual, scheduled, automated)
- actions array with results
- performance metrics
- timestamps

### Log
- userId (reference to User)
- sessionId, proxyId (optional)
- type, level, message
- metadata, error info
- 30-day TTL for auto-deletion

## Socket.io Events

### Session Events
- session:started
- session:ended
- session:action_executed
- session:paused
- session:resumed
- session:update

### Log Events
- log:live
- log:new
- logs:subscribed
- logs:unsubscribed

### Proxy Events
- proxy:verification_started
- proxy:verification_completed
- proxy:status_changed

### Dashboard Events
- dashboard:stats
- metrics:update

## Setup Instructions

### Prerequisites
- Node.js 14+ 
- MongoDB 5.0+
- npm or yarn

### Installation

1. Clone repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start MongoDB
5. Run migrations (if needed)
6. Start server:
   ```bash
   npm run dev        # Development
   npm start          # Production
   ```

### Frontend Setup

1. Open `frontend/index.html` in browser
2. Or serve with a static server:
   ```bash
   python -m http.server 3000  # Python
   http-server                 # Node.js
   ```

## Configuration

### Environment Variables

**Required:**
- NODE_ENV (development/production)
- MONGODB_URI
- JWT_SECRET (min 32 characters in production)

**Optional:**
- HOST, PORT, CORS_ORIGIN
- SESSION_TIMEOUT, MAX_ACTIVE_SESSIONS
- RATE_LIMIT settings

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] JWT_SECRET changed
- [ ] CORS_ORIGIN set correctly
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] HTTPS enabled
- [ ] Backup strategy in place
- [ ] Database indices created
- [ ] Monitoring configured

### Docker Support

See Dockerfile and docker-compose.yml for containerization.

## Development

### Running Tests
```bash
npm test              # Run tests with coverage
npm run test:watch   # Watch mode
```

### Linting
```bash
npm run lint         # ESLint check
```

### Database Seeding
```bash
npm run seed         # Populate with sample data
```

## Performance Considerations

- Indexed queries on userId, status, timestamps
- Log TTL for automatic cleanup
- Socket.io rooms for isolated broadcasts
- Pagination on list endpoints (default: 20 items)
- Connection pooling for MongoDB

## Security

- Password hashing with bcryptjs (10 rounds)
- JWT token expiry (7 days)
- CORS protection
- No sensitive data in logs
- SQL injection prevention
- CSRF protection ready

## License

MIT - See LICENSE file
