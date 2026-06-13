// ==========================================
// TRAFFICBOT PRO - Dashboard Application
// Premium Dark Futuristic Dashboard
// ==========================================

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Application State
const appState = {
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: null,
    currentSection: 'dashboard',
    isAuthenticated: !!localStorage.getItem('token'),
    data: {
        stats: {},
        sessions: [],
        proxies: [],
        logs: []
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    if (appState.isAuthenticated) {
        initializeApp();
    } else {
        showAuthModal();
    }
});

// Initialize App
async function initializeApp() {
    console.log('Initializing application...');
    
    // Setup navigation
    setupNavigation();
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Load dashboard data
    loadDashboardData();
    
    // Setup animations
    setupAnimations();
}

// Setup Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
        });
    });
}

// Switch Section
function switchSection(section) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${section}-section`).classList.add('active');
    
    // Update header
    const sectionTitles = {
        'dashboard': { title: 'Dashboard', subtitle: 'Real-time Traffic Automation' },
        'traffic': { title: 'Traffic Mode', subtitle: 'Control your traffic generation' },
        'sessions': { title: 'Session Settings', subtitle: 'Manage your sessions' },
        'profiles': { title: 'Profile Manager', subtitle: 'Manage your profiles' },
        'proxies': { title: 'Proxy Manager', subtitle: 'Manage your proxies' },
        'run-bot': { title: 'Run Bot', subtitle: 'Execute automated tasks' },
        'rpa': { title: 'RPA Builder', subtitle: 'Build RPA workflows' },
        'logs': { title: 'Activity Logs', subtitle: 'View your activities' },
        'analytics': { title: 'Analytics', subtitle: 'Analyze your performance' },
        'license': { title: 'License Manager', subtitle: 'Manage your license' },
        'settings': { title: 'Settings', subtitle: 'Configure application' }
    };
    
    const titles = sectionTitles[section] || { title: 'Dashboard', subtitle: 'Welcome' };
    document.getElementById('page-title').textContent = titles.title;
    document.getElementById('page-subtitle').textContent = titles.subtitle;
    
    appState.currentSection = section;
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Simulate API calls - in real app, these would fetch from backend
        const stats = {
            activeSessions: 2847,
            trafficGenerated: 156200,
            successRate: 98.7,
            storageUsed: 42.8
        };
        
        appState.data.stats = stats;
        renderDashboard();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Error loading data', 'error');
    }
}

// Render Dashboard
function renderDashboard() {
    const stats = appState.data.stats;
    
    // Update stat cards if needed
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        // Stats are already rendered in HTML
        console.log('Dashboard rendered with stats:', stats);
    }
}

// Setup Animations
function setupAnimations() {
    // Add hover animations to cards
    const cards = document.querySelectorAll('.card, .stat-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover animations to nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Show Auth Modal
function showAuthModal() {
    const html = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        ">
            <div style="
                background: linear-gradient(135deg, #121A2D, #0B1020);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 20px;
                padding: 40px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
            ">
                <h1 style="
                    font-size: 28px;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #FF8A00, #8B5CF6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">TrafficBot Pro</h1>
                <p style="color: #94A3B8; margin-bottom: 30px;">Login to continue</p>
                
                <input type="email" id="auth-email" placeholder="Email" style="
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 12px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: 8px;
                    color: #FFFFFF;
                    font-size: 14px;
                ">
                
                <input type="password" id="auth-password" placeholder="Password" style="
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 30px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: 8px;
                    color: #FFFFFF;
                    font-size: 14px;
                ">
                
                <button id="auth-btn" style="
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #FF8A00, #8B5CF6);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                ">
                    Login
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    document.getElementById('auth-btn').addEventListener('click', () => {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        
        if (email && password) {
            // Simulate login
            appState.token = 'demo-token-' + Date.now();
            appState.isAuthenticated = true;
            localStorage.setItem('token', appState.token);
            
            document.querySelector('[style*="position: fixed"]').remove();
            initializeApp();
            showToast('Login successful!', 'success');
        } else {
            showToast('Please fill in all fields', 'error');
        }
    });
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        appState.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        location.reload();
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// API Helper - Make Requests
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (appState.token) {
        headers['Authorization'] = `Bearer ${appState.token}`;
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                logout();
            }
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast('API Error: ' + error.message, 'error');
        return null;
    }
}

// Setup Search
document.querySelector('.search-input')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    console.log('Search:', query);
    // Add search functionality here
});

// Setup Notifications
document.querySelector('.notification-btn')?.addEventListener('click', () => {
    showToast('You have 3 notifications', 'info');
});

// Setup User Profile Dropdown
document.querySelector('.user-profile')?.addEventListener('click', () => {
    showToast('Profile menu - Coming soon', 'info');
});

// Chart bar hover effect
document.querySelectorAll('.chart-bar').forEach(bar => {
    bar.addEventListener('mouseenter', function() {
        this.style.opacity = '0.8';
    });
    bar.addEventListener('mouseleave', function() {
        this.style.opacity = '1';
    });
});

// Real-time updates simulation
setInterval(() => {
    // Simulate real-time status updates
    const dots = document.querySelectorAll('.live-dot');
    dots.forEach(dot => {
        dot.style.opacity = Math.random() > 0.5 ? '1' : '0.5';
    });
}, 1000);



// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  // Auth
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  document.getElementById('toggleRegister').addEventListener('click', (e) => {
    e.preventDefault();
    toggleAuthModal();
  });
  document.getElementById('toggleLogin').addEventListener('click', (e) => {
    e.preventDefault();
    toggleAuthModal();
  });

  // Navigation
  document.getElementById('statsBtn').addEventListener('click', () => switchSection('stats'));
  document.getElementById('sessionsBtn').addEventListener('click', () => switchSection('sessions'));
  document.getElementById('proxiesBtn').addEventListener('click', () => switchSection('proxies'));
  document.getElementById('logsBtn').addEventListener('click', () => switchSection('logs'));
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Sessions
  document.getElementById('newSessionBtn').addEventListener('click', () => {
    document.getElementById('newSessionForm').classList.toggle('hidden');
  });
  document.getElementById('cancelSessionBtn').addEventListener('click', () => {
    document.getElementById('newSessionForm').classList.add('hidden');
  });
  document.getElementById('sessionForm').addEventListener('submit', handleCreateSession);

  // Proxies
  document.getElementById('newProxyBtn').addEventListener('click', () => {
    document.getElementById('newProxyForm').classList.toggle('hidden');
  });
  document.getElementById('cancelProxyBtn').addEventListener('click', () => {
    document.getElementById('newProxyForm').classList.add('hidden');
  });
  document.getElementById('proxyForm').addEventListener('submit', handleCreateProxy);

  // Logs
  document.getElementById('refreshLogsBtn').addEventListener('click', loadLogs);
  document.getElementById('logTypeFilter').addEventListener('change', loadLogs);
  document.getElementById('logLevelFilter').addEventListener('change', loadLogs);
}

// ========== AUTH FUNCTIONS ==========
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    appState.token = data.token;
    appState.refreshToken = data.refreshToken;
    appState.user = data.user;

    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    showToast(`Welcome back, ${data.user.username}!`, 'success');
    showDashboard();
    initializeSocket();
    loadDashboardData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    appState.token = data.token;
    appState.refreshToken = data.refreshToken;
    appState.user = data.user;

    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    showToast(`Welcome, ${data.user.username}!`, 'success');
    showDashboard();
    initializeSocket();
    loadDashboardData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function handleLogout() {
  appState.token = null;
  appState.refreshToken = null;
  appState.user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  if (appState.socket) {
    appState.socket.disconnect();
  }

  showLogin();
  showToast('Logged out successfully', 'success');
}

function toggleAuthModal() {
  document.getElementById('loginModal').classList.toggle('active');
  document.getElementById('registerModal').classList.toggle('active');
}

// ========== UI FUNCTIONS ==========
function showLogin() {
  document.getElementById('dashboardContent').classList.add('hidden');
  document.getElementById('loginModal').classList.add('active');
  document.getElementById('registerModal').classList.remove('active');
}

function showDashboard() {
  document.getElementById('dashboardContent').classList.remove('hidden');
  document.getElementById('loginModal').classList.remove('active');
}

function switchSection(section) {
  appState.currentSection = section;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section + 'Section').classList.add('active');

  switch (section) {
    case 'sessions':
      loadSessions();
      break;
    case 'proxies':
      loadProxies();
      break;
    case 'logs':
      loadLogs();
      break;
  }
}

// ========== API FUNCTIONS ==========
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${appState.token}`,
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    handleLogout();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// ========== DASHBOARD DATA ==========
async function loadDashboardData() {
  try {
    const data = await apiCall('/realtime/dashboard/stats');
    appState.data.stats = data.stats;
    updateStatsUI();
    
    // Refresh every 5 seconds
    setInterval(async () => {
      try {
        const stats = await apiCall('/realtime/dashboard/stats');
        appState.data.stats = stats.stats;
        updateStatsUI();
      } catch (error) {
        console.error('Failed to refresh stats:', error);
      }
    }, 5000);
  } catch (error) {
    showToast('Failed to load dashboard data', 'error');
  }
}

function updateStatsUI() {
  const stats = appState.data.stats;
  document.getElementById('activeSessions').textContent = stats.activeSessions || 0;
  document.getElementById('totalSessions').textContent = stats.totalSessions || 0;
  document.getElementById('successRate').textContent = (stats.successRate || 0) + '%';
  document.getElementById('verifiedProxies').textContent = stats.verifiedProxies || 0;
  document.getElementById('metricsActiveSessions').textContent = stats.activeSessions || 0;
}

// ========== SESSIONS ==========
async function loadSessions() {
  try {
    const data = await apiCall('/sessions?limit=20');
    appState.data.sessions = data.sessions;
    renderSessions();
  } catch (error) {
    showToast('Failed to load sessions', 'error');
  }
}

function renderSessions() {
  const container = document.getElementById('sessionsList');
  
  if (appState.data.sessions.length === 0) {
    container.innerHTML = '<p class="placeholder">No sessions yet. Create one to get started!</p>';
    return;
  }

  container.innerHTML = appState.data.sessions.map(session => `
    <div class="item-card">
      <div>
        <h3>${session.name}</h3>
        <p>${session.sessionType} • ${session.status}</p>
        <div class="item-meta">
          <span class="badge badge-info">Actions: ${session.actionCount}</span>
          <span class="badge badge-success">Success: ${session.successCount}</span>
          <span class="badge badge-danger">Failed: ${session.failureCount}</span>
        </div>
      </div>
      <div class="item-actions">
        ${session.status === 'pending' ? `<button class="btn btn-success btn-small" onclick="startSession('${session._id}')">Start</button>` : ''}
        ${session.status === 'active' ? `<button class="btn btn-warning btn-small" onclick="pauseSession('${session._id}')">Pause</button>` : ''}
        ${session.status === 'paused' ? `<button class="btn btn-info btn-small" onclick="resumeSession('${session._id}')">Resume</button>` : ''}
        <button class="btn btn-danger btn-small" onclick="deleteSession('${session._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

async function handleCreateSession(e) {
  e.preventDefault();
  const name = document.getElementById('sessionName').value;
  const sessionType = document.getElementById('sessionType').value;

  try {
    await apiCall('/sessions', {
      method: 'POST',
      body: JSON.stringify({ name, sessionType })
    });

    showToast('Session created successfully', 'success');
    document.getElementById('sessionForm').reset();
    document.getElementById('newSessionForm').classList.add('hidden');
    loadSessions();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function startSession(sessionId) {
  try {
    await apiCall(`/sessions/${sessionId}/start`, { method: 'POST' });
    showToast('Session started', 'success');
    loadSessions();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteSession(sessionId) {
  if (!confirm('Delete this session?')) return;
  try {
    await apiCall(`/sessions/${sessionId}`, { method: 'DELETE' });
    showToast('Session deleted', 'success');
    loadSessions();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ========== PROXIES ==========
async function loadProxies() {
  try {
    const data = await apiCall('/proxies?limit=20');
    appState.data.proxies = data.proxies;
    renderProxies();
  } catch (error) {
    showToast('Failed to load proxies', 'error');
  }
}

function renderProxies() {
  const container = document.getElementById('proxiesList');

  if (appState.data.proxies.length === 0) {
    container.innerHTML = '<p class="placeholder">No proxies added yet.</p>';
    return;
  }

  container.innerHTML = appState.data.proxies.map(proxy => `
    <div class="item-card">
      <div>
        <h3>${proxy.name}</h3>
        <p>${proxy.protocol.toUpperCase()} • ${proxy.host}:${proxy.port}</p>
        <div class="item-meta">
          <span class="badge ${proxy.status === 'verified' ? 'badge-success' : 'badge-warning'}">
            ${proxy.status}
          </span>
          <span class="badge badge-info">Success Rate: ${proxy.performance.successRate.toFixed(1)}%</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn btn-primary btn-small" onclick="verifyProxy('${proxy._id}')">Verify</button>
        <button class="btn btn-danger btn-small" onclick="deleteProxy('${proxy._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

async function handleCreateProxy(e) {
  e.preventDefault();
  const name = document.getElementById('proxyName').value;
  const protocol = document.getElementById('proxyProtocol').value;
  const host = document.getElementById('proxyHost').value;
  const port = parseInt(document.getElementById('proxyPort').value);
  const username = document.getElementById('proxyUsername').value || null;
  const password = document.getElementById('proxyPassword').value || null;

  try {
    await apiCall('/proxies', {
      method: 'POST',
      body: JSON.stringify({ name, protocol, host, port, username, password })
    });

    showToast('Proxy added successfully', 'success');
    document.getElementById('proxyForm').reset();
    document.getElementById('newProxyForm').classList.add('hidden');
    loadProxies();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function verifyProxy(proxyId) {
  try {
    const result = await apiCall(`/proxies/${proxyId}/verify`, { method: 'POST' });
    const message = result.verified ? 'Proxy verified! ✓' : 'Proxy verification failed';
    showToast(message, result.verified ? 'success' : 'warning');
    loadProxies();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteProxy(proxyId) {
  if (!confirm('Delete this proxy?')) return;
  try {
    await apiCall(`/proxies/${proxyId}`, { method: 'DELETE' });
    showToast('Proxy deleted', 'success');
    loadProxies();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ========== LOGS ==========
async function loadLogs() {
  try {
    const type = document.getElementById('logTypeFilter').value;
    const level = document.getElementById('logLevelFilter').value;
    const query = new URLSearchParams();
    if (type) query.append('type', type);
    if (level) query.append('level', level);

    const data = await apiCall(`/realtime/logs/recent?${query.toString()}`);
    appState.data.logs = data.logs;
    renderLogs();
  } catch (error) {
    showToast('Failed to load logs', 'error');
  }
}

function renderLogs() {
  const container = document.getElementById('logsList');

  if (appState.data.logs.length === 0) {
    container.innerHTML = '<p class="placeholder">No logs available.</p>';
    return;
  }

  container.innerHTML = appState.data.logs.map(log => `
    <div class="log-item">
      <div class="log-time">${new Date(log.createdAt).toLocaleString()}</div>
      <div class="log-message">${log.message}</div>
      <div class="item-meta">
        <span class="badge badge-info">${log.type}</span>
        <span class="badge ${getLogLevelBadgeClass(log.level)}">${log.level}</span>
      </div>
    </div>
  `).join('');
}

function getLogLevelBadgeClass(level) {
  const map = {
    'debug': 'badge-info',
    'info': 'badge-info',
    'warn': 'badge-warning',
    'error': 'badge-danger'
  };
  return map[level] || 'badge-info';
}

// ========== SOCKET.IO ==========
function initializeSocket() {
  appState.socket = io(SOCKET_URL, {
    auth: { token: appState.token }
  });

  appState.socket.on('connected', (data) => {
    showToast('Connected to real-time server', 'success');
    document.getElementById('systemStatus').textContent = '🟢 Connected';
  });

  appState.socket.on('session:started', (data) => {
    showToast(`Session started: ${data.name}`, 'success');
    if (appState.currentSection === 'sessions') loadSessions();
  });

  appState.socket.on('session:ended', (data) => {
    showToast(`Session completed`, 'success');
    if (appState.currentSection === 'sessions') loadSessions();
  });

  appState.socket.on('session:action_executed', (data) => {
    console.log('Action executed:', data);
  });

  appState.socket.on('log:live', (logData) => {
    appState.data.logs.unshift(logData);
    if (appState.data.logs.length > 100) appState.data.logs.pop();
    if (appState.currentSection === 'logs') renderLogs();
  });

  appState.socket.on('dashboard:stats', (stats) => {
    appState.data.stats = stats;
    updateStatsUI();
  });

  appState.socket.on('metrics:update', (metrics) => {
    document.getElementById('metricsActiveSessions').textContent = metrics.activeSessions || 0;
    document.getElementById('metricsRecentLogs').textContent = metrics.activeLogs || 0;
  });

  appState.socket.on('error', () => {
    document.getElementById('systemStatus').textContent = '🔴 Disconnected';
  });

  appState.socket.on('disconnect', () => {
    document.getElementById('systemStatus').textContent = '🔴 Disconnected';
    showToast('Connection lost', 'warning');
  });
}

// ========== NOTIFICATIONS ==========
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  document.getElementById('toastContainer').appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
