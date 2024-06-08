require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function testConnection() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    const result = await pool.request().query('SELECT 1 AS test');
    console.log('Test Query Result:', result.recordset);
    sql.close();
  } catch (err) {
    console.error('Database Connection Failed! Error:', err);
  }
}

testConnection();
