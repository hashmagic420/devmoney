// Import the required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create the express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server);

// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static(__dirname + '/public')); // Ensure your HTML is in the 'public' folder

// Listen for new connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast message to all clients
    });

    // Listen for user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
