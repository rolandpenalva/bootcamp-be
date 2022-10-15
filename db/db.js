const { Pool } = require("pg");
const getPool = () => {
  const dbObj = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    max: process.env.DB_MAX,
    idleTimeoutMillis: process.env.DB_TIMEOUT,
  };
  const pool = new Pool(dbObj);
  return pool;
};

module.exports = getPool;
