const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// Create a new Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files (your HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, '/')));

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for chat messages and broadcast them
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Handle user disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

