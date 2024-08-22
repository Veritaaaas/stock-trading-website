const express = require('express');
const app = express();
const port = 3001;

app.get('/api', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});