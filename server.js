const fastify = require('fastify')({ logger: true });
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

// Serve static HTML or your front-end
fastify.get('/', (request, reply) => {
  const filePath = path.join(__dirname, 'index.html');
  const fileStream = fs.createReadStream(filePath);
  reply.type('text/html').send(fileStream);
});

// Start the Fastify server on Heroku's dynamic port or local port 3000
const port = process.env.PORT || 3000;  // Heroku sets `process.env.PORT`
fastify.listen(port, '0.0.0.0', (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);

  // Create WebSocket server
  const wss = new WebSocket.Server({ server: fastify.server });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      // Broadcast drawing data to all clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });
});
