const { createServer } = require('http');
const next = require('next');
const path = require('path');

// Explicitly load .env.local
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
