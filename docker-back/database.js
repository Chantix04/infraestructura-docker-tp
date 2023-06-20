const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'tienda',
  connectionLimit: 5,
});

// Crear la tabla productos si no existe
(async () => {
  let dbConnection;
  try {
    dbConnection = await pool.getConnection();
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio DECIMAL(10,2) NOT NULL
      )
    `);
  } catch (error) {
    throw error;
  } finally {
    if (dbConnection) dbConnection.end();
  }
})();

module.exports = pool;
