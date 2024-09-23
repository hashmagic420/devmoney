// server.js
const express = require('express');
const Ably = require('ably');
const cors = require('cors');

const app = express();

// Configure CORS to restrict access to your domain
app.use(cors({
  origin: ['https://devmoney.co'], // Replaced 'yourdomain.com' with 'devmoney.co'
}));

const ably = new Ably.Rest('YOUR_ABLY_API_KEY'); // Replace with your actual API key

app.get('/auth', (req, res) => {
  const clientId = 'uniqueClientId'; // You can generate or assign unique IDs to users
  ably.auth.createTokenRequest({ clientId: clientId }, (err, tokenRequest) => {
    if (err) {
      res.status(500).send('Error requesting token: ' + err);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(tokenRequest));
    }
  });
});

app.listen(3000, () => {
  console.log('Token authentication server is running on port 3000');
});
