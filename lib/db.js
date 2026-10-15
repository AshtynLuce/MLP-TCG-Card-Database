const { Pool } = require("pg");

// Reuse the pool across warm serverless invocations
const pool = global._pgPool || (global._pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || "") ? false : { rejectUnauthorized: false },
}));

const TABLE = (process.env.CARDS_TABLE || "cards").replace(/[^a-zA-Z0-9_]/g, "");
module.exports = { pool, TABLE };
