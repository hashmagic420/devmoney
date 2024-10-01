const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

// Serve static HTML
fastify.get('/', (request, reply) => {
  const filePath = path.join(__dirname, 'index.html');
  const fileStream = fs.createReadStream(filePath);
  reply.type('text/html').send(fileStream);
});

// Start the Fastify server
fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);

  // Create WebSocket server
  const wss = new WebSocket.Server({ server: fastify.server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      // Broadcast the message to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });
});
