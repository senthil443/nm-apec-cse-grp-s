const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3001;

const db = new sqlite3.Database('newsdb.db');

// ... (existing code)

// API endpoint to fetch paginated and filtered news articles
app.get('/api/news', (req, res) => {
  // ... (existing code)

  // Emit real-time updates to connected clients
  io.emit('newsUpdate', { action: 'fetch', data: rows });

  // ... (existing code)
});

// Real-time updates via WebSocket
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});