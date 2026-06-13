# SaaS Dashboard - Frontend

Modern, responsive dashboard UI for managing sessions, proxies, and logs with real-time updates.

## 🚀 Quick Start

### Option 1: Direct Browser
Simply open `index.html` in your web browser. The app will attempt to connect to `http://localhost:5000`.

### Option 2: Local Server

```bash
# Using Python 3
python -m http.server 3000

# Using Node.js
npx http-server -p 3000

# Using Python 2
python -m SimpleHTTPServer 3000
```

Then open `http://localhost:3000`

## 🎨 Features

✅ User Authentication
- Login & registration forms
- Token-based authentication
- Auto-logout on 401

✅ Dashboard
- Real-time statistics
- Active sessions counter
- Success rate metrics
- Verified proxies count
- Live system status

✅ Sessions Management
- Create new sessions
- View session list
- Start/pause/resume sessions
- Delete sessions
- Real-time status updates

✅ Proxies Management
- Add new proxies
- Verify connectivity (simulated)
- View proxy health metrics
- Delete proxies
- Success rate tracking

✅ Activity Logs
- View all activity logs
- Filter by type
- Filter by level
- Real-time log streaming
- Timestamp display

✅ Real-Time Updates
- Socket.io integration
- Live session events
- Live log streaming
- Dashboard auto-refresh
- System status indicator

## 📱 Responsive Design

- Desktop optimized
- Tablet friendly
- Mobile responsive
- Touch-friendly buttons
- Adaptive layout

## 🔑 Authentication Flow

1. Enter email & password
2. Click "Login" or "Register"
3. JWT token stored in localStorage
4. Auto-connect to real-time server
5. Dashboard loads data

## 🔄 API Integration

The frontend communicates with the backend at `http://localhost:5000/api`

All requests include JWT token in Authorization header:
```
Authorization: Bearer {token}
```

## 🔌 Socket.io Connection

Real-time updates via Socket.io:

```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'JWT_TOKEN_HERE' }
});

socket.on('session:started', (data) => {
  console.log('Session started:', data);
});
```

## 📊 Dashboard Sections

### Dashboard Overview
- 4 stat cards (active, total, success rate, verified proxies)
- Live metrics display
- System connection status

### Sessions
- Create new session form
- Session list with details
- Action buttons (start, pause, resume, delete)
- Real-time status updates

### Proxies
- Add proxy form
- Proxy list with health metrics
- Verify & delete actions
- Success rate display

### Logs
- Filterable log list
- Filter by type and level
- Timestamp for each entry
- Color-coded badges

## 🎯 Key Components

### HTML Structure
- Navigation bar
- Auth modals (login/register)
- Dashboard sections
- Toast notification container

### CSS Styling
- CSS variables for theming
- Grid-based layout
- Smooth animations
- Responsive breakpoints

### JavaScript Logic
- State management (appState)
- Event listeners
- API calls with error handling
- Socket.io listeners
- Toast notifications

## 🔐 Local Storage

```
token          # JWT access token
refreshToken   # JWT refresh token
```

## 💬 Toast Notifications

Success, error, and warning notifications appear in bottom-right corner with auto-dismiss after 3 seconds.

```javascript
showToast('Message', 'success|error|warning|info');
```

## 🎨 Color Scheme

- Primary: #2563eb (Blue)
- Success: #10b981 (Green)
- Danger: #ef4444 (Red)
- Warning: #f59e0b (Orange)
- Background: #f8fafc (Light)

## 📋 Configuration

Edit these constants in `index.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';
```

## 🔄 Data Flow

1. User login → Get JWT token
2. Token stored → Socket.io connects
3. Dashboard data loads → Display stats
4. Real-time events → Update UI
5. User actions → API calls
6. Socket.io events → Refresh UI

## 📱 Sections State Management

```javascript
appState = {
  token,           // JWT token
  refreshToken,    // Refresh token
  user,            // User data
  socket,          // Socket.io instance
  currentSection,  // Current page
  data: {
    sessions,      // Session list
    proxies,       // Proxy list
    logs,          // Log list
    stats          // Dashboard stats
  }
}
```

## 🐛 Debugging

Open browser DevTools (F12) to see:
- Network requests
- Console logs
- Storage (localStorage)
- Real-time events

## 📚 External Libraries

- [Socket.io Client](https://socket.io/docs/v4/client-api/) - Real-time communication

## 📄 File Structure

```
frontend/
├── index.html    # HTML template
├── index.css     # Styling
├── index.js      # Application logic
└── README.md     # This file
```

## ✨ Notes

- No build step required
- No dependencies except Socket.io
- Works in all modern browsers
- Progressive enhancement approach

## 📄 License

MIT
