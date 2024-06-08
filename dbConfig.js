require('dotenv').config();
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'sqlserver',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'password@Password',
    },
  },
  options: {
    database: process.env.DB_NAME || 'master',
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 30000 // 30 seconds timeout for connection
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log(pool);
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.error('Database Connection Failed! Bad Config:  ' + config, err));

module.exports = {
  sql, poolPromise
};
