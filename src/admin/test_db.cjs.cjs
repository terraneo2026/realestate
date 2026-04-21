const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  try {
    console.log('Testing primary connection...');
    const conn1 = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });
    console.log('Primary connection success!');
    await conn1.end();
  } catch (err) {
    console.log('Primary failed:', err.message);
  }

  try {
    console.log('Testing fallback connection...');
    const conn2 = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'relowicy_appapp',
      password: 'relowicy_appapp',
      database: 'relowicy_appapp',
      connectTimeout: 5000
    });
    console.log('Fallback connection success!');
    await conn2.end();
  } catch (err) {
    console.log('Fallback failed:', err.message);
  }
}

test();
