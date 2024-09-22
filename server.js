const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem')
};

const server = https.createServer(options, app);
const io = require('socket.io')(server, {
  cors: {
    origin: "https://www.devmoney.co",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Serve static files from the current directory
app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(443, () => {
  console.log('Server listening on port 443');
});
