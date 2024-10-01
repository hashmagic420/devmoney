const fastify = require('fastify')({ logger: true });
const WebSocket = require('ws');

// Serve the frontend
const path = require('path');
const fs = require('fs');

fastify.get('/', (request, reply) => {
  const filePath = path.join(__dirname, 'index.html');
  const fileStream = fs.createReadStream(filePath);
  reply.type('text/html').send(fileStream);
});

// Start Fastify on port 3000 (Heroku will manage the port in production)
fastify.listen(process.env.PORT || 3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);

  // Create WebSocket server
  const wss = new WebSocket.Server({ server: fastify.server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      // Broadcast drawing data to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });
});
