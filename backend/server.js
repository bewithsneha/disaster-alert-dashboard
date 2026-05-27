const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./database');
const alertsRouter = require('./routes/alerts');
const authRouter = require('./routes/auth');
const { fetchUSGS } = require('./services/usgs.service');
const { fetchEONET } = require('./services/eonet.service');
const { fetchWeather } = require('./services/weather.service');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretdisasterkey';
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL) || 60000;

const timestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.use('/api/auth', authRouter);
app.use('/api/alerts', authenticateToken, alertsRouter);

io.on('connection', (socket) => {
  console.log(`[${timestamp()}] User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[${timestamp()}] User disconnected: ${socket.id}`);
  });
});

const broadcastAlert = (alert) => {
  io.emit('new_alert', alert);
};

const processAlert = (alert) => {
  const { id, title, type, severity, country, lat, lng, timestamp: ts } = alert;
  
  db.get('SELECT id FROM alerts WHERE id = ?', [id], (err, row) => {
    if (err) return console.error(`[${timestamp()}] Error checking alert:`, err);
    
    if (!row) {
      db.run(
        'INSERT INTO alerts (id, title, type, severity, country, lat, lng, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, title, type, severity, country, lat, lng, ts],
        (err) => {
          if (err) {
            console.error(`[${timestamp()}] Error inserting alert:`, err);
          } else {
            console.log(`[${timestamp()}] New Alert Saved: ${title}`);
            broadcastAlert(alert);
          }
        }
      );
    }
  });
};

const pollAPIs = async () => {
  console.log(`[${timestamp()}] Polling APIs...`);
  try {
    const usgsAlerts = await fetchUSGS();
    usgsAlerts.forEach(processAlert);
    console.log(`[${timestamp()}] USGS: ${usgsAlerts.length} alerts fetched`);
  } catch (error) {
    console.error(`[${timestamp()}] USGS error:`, error.message);
  }

  try {
    const eonetAlerts = await fetchEONET();
    eonetAlerts.forEach(processAlert);
    console.log(`[${timestamp()}] EONET: ${eonetAlerts.length} alerts fetched`);
  } catch (error) {
    console.error(`[${timestamp()}] EONET error:`, error.message);
  }

  if (process.env.WEATHER_API_KEY) {
    try {
      const weatherAlerts = await fetchWeather(process.env.WEATHER_API_KEY);
      weatherAlerts.forEach(processAlert);
      console.log(`[${timestamp()}] Weather: ${weatherAlerts.length} alerts fetched`);
    } catch (error) {
      console.error(`[${timestamp()}] Weather error:`, error.message);
    }
  }
};

setInterval(pollAPIs, POLL_INTERVAL);
pollAPIs();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[${timestamp()}] Server listening on port ${PORT} (polling every ${POLL_INTERVAL / 1000}s)`);
});
