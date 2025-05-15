const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());

app.get('/api/products', (req, res) => {
  fs.readFile('./products.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read products.json' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}/api/products`);
});