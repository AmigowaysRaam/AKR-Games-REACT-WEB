const { Pool } = require('pg');

const password = process.env.DB_PASS || process.env.DB_PASSWORD || '';  // Your .env has DB_PASSWORD!
console.log('🔑 Password:', password ? 'SET ✅' : 'EMPTY ❌');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: password,
  ssl: false   // ← THIS FIXES "server does not support SSL"!
});

module.exports = pool;