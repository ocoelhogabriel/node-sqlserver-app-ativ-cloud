require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'password@Password',
  server: process.env.DB_SERVER || 'sqlserver',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    database: process.env.DB_NAME || 'master',
    encrypt: false, // Usa SSL
    trustServerCertificate: true, // Usado em desenvolvimento para ignorar o certificado
    enableArithAbort: true, // Habilita tratamento de erros aritméticos
    connectTimeout: 15000, // Timeout de conexão em milissegundos
    requestTimeout: 30000, // Timeout de requisição em milissegundos
  }
};

// Criar pool de conexão
const poolPromise = sql.connect(config)
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
