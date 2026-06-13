# SaaS Dashboard - Setup Guide

Complete setup instructions for development and production deployment.

## 📋 Prerequisites

### System Requirements
- Node.js 14.0 or higher
- npm 6.0 or higher (comes with Node.js)
- MongoDB 5.0 or higher (local or cloud)
- Git (for version control)

### Check Installation
```bash
node --version      # Should be v14+
npm --version       # Should be v6+
mongo --version     # If using local MongoDB
```

## 🛠️ Development Setup

### Step 1: Clone & Install

```bash
# Navigate to project directory
cd SaaS-Dashboard

# Install backend dependencies
cd backend
npm install

# Install frontend (no installation needed, just open in browser)
cd ../frontend
```

### Step 2: Configure Environment

```bash
# In backend directory
cp .env.example .env

# Edit .env with your settings
# Important: Set MONGODB_URI correctly
```

**Development .env:**
```env
NODE_ENV=development
HOST=0.0.0.0
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saas-dashboard-dev
JWT_SECRET=dev-secret-key-32-chars-min-production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux with systemd
sudo systemctl start mongod

# Windows
net start MongoDB

# Or manually run
mongod
```

**Cloud MongoDB (MongoDB Atlas):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Step 4: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
[Socket.io] Real-time system initialized
╔════════════════════════════════════════╗
║     SaaS DASHBOARD SERVER STARTED      ║
╠════════════════════════════════════════╣
║ Host:        0.0.0.0                  ║
║ Port:        5000                     ║
║ Environment: development              ║
╚════════════════════════════════════════╝
```

### Step 5: Start Frontend

**Option A: Direct (Recommended for dev)**
```bash
cd frontend
# Open index.html directly in browser
open index.html  # macOS
# Or manually navigate to file:///path/to/frontend/index.html
```

**Option B: Local Server**
```bash
# From frontend directory
python -m http.server 3000
# Navigate to http://localhost:3000
```

### Step 6: Test Application

1. Open browser to `http://localhost:3000` (or `file://...` if direct)
2. Register new account
3. Try creating session/proxy
4. Check console for real-time updates
5. Verify logs appear in real-time

## 🚀 Production Setup

### Step 1: Production Environment

```bash
cd backend
cp .env.production .env
```

**Production .env:**
```env
NODE_ENV=production
HOST=0.0.0.0
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true
JWT_SECRET=generate-64-char-random-string-for-production
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

Generate secure JWT secret:
```bash
# Generate random 64-char string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Build & Test

```bash
cd backend

# Install dependencies
npm install --production

# Run tests
npm test

# Start production server
npm start
```

### Step 3: Database Migration

```bash
# Seed database with sample data (optional)
npm run seed

# Create database indices
# This usually happens automatically, but ensure:
node scripts/create-indices.js
```

### Step 4: Frontend Deployment

**Option A: Static Hosting (Vercel, Netlify)**
```bash
# Deploy frontend folder as static site
# Update API_URL in index.js to your backend URL
```

**Option B: CDN or Web Server**
```bash
# Copy frontend files to your web server
# Configure CORS on backend for your domain
```

**Option C: Same Server**
```bash
# Serve frontend from Express
app.use(express.static('public'));
```

## 🐳 Docker Setup

### Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongodb:27017/saas-dashboard
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongodb

volumes:
  mongo_data:
```

Run with Docker:
```bash
docker-compose up -d
```

## 📊 Database Setup

### MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create free cluster
3. Add user credentials
4. Get connection string
5. Whitelist IP addresses
6. Update MONGODB_URI in .env

### Local MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download from mongodb.com and run installer
```

### Initialize Collections

The application auto-creates collections on first use, but you can manually seed:

```bash
npm run seed
```

## 🔐 Security Checklist

- [ ] JWT_SECRET is 32+ characters in production
- [ ] CORS_ORIGIN set to your domain only
- [ ] HTTPS enabled in production
- [ ] Database password is strong
- [ ] MongoDB access limited to app server
- [ ] API rate limiting enabled
- [ ] Error messages don't leak sensitive info
- [ ] Logs don't contain passwords/tokens
- [ ] SSL certificates valid
- [ ] Backups automated

## 📈 Scaling Considerations

### For High Traffic

1. **Database**
   - Use MongoDB replica set
   - Enable sharding
   - Add indices for common queries

2. **Backend**
   - Use load balancer (nginx, HAProxy)
   - Run multiple instances
   - Use Redis for session storage
   - Implement caching

3. **Socket.io**
   - Use Redis adapter for scaling
   - Deploy across multiple servers
   - Monitor socket connections

4. **Frontend**
   - Serve from CDN
   - Minify CSS/JS
   - Compress assets

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
Solution:
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
Solution:
- Update CORS_ORIGIN in .env
- Restart backend server

### Socket.io Connection Failed
```
Socket not connecting
```
Solution:
- Verify backend is running
- Check firewall settings
- Browser console for errors

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution:
```bash
# Kill process on port 5000
kill -9 $(lsof -ti:5000)  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

## 📚 Useful Commands

```bash
# Backend development
npm run dev              # Start with nodemon
npm run dev:debug       # Start with debugger
npm test                # Run tests
npm run lint            # ESLint check

# Backend production
npm start               # Start server
npm run seed            # Seed database

# Database
mongo saas-dashboard    # Connect to local DB
db.users.find()        # Query users
```

## 📞 Support Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Socket.io Docs](https://socket.io/docs/)
- [Mongoose Docs](https://mongoosejs.com/)

## 📋 Pre-launch Checklist

Development:
- [ ] Backend running without errors
- [ ] Frontend loads dashboard
- [ ] Login/Register working
- [ ] Real-time updates working
- [ ] All CRUD operations tested

Production:
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backed up
- [ ] Monitoring set up
- [ ] Error logging configured
- [ ] Load testing passed
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team trained
- [ ] Deployment plan approved

## 🎉 Next Steps

1. **Customize**: Update branding, colors, features
2. **Test**: Create test accounts, verify functionality
3. **Deploy**: Follow production setup above
4. **Monitor**: Set up logging and alerts
5. **Scale**: Monitor performance and scale as needed

## 📄 License

MIT
