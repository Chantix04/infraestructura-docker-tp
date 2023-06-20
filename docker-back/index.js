require('dotenv').config();
const express = require('express');
const pool = require('./database');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.set('port', process.env.PORT || 3000);

// Middleware para obtener la conexión antes de cada solicitud
app.use((req, res, next) => {
  if (!app.locals.dbConnection) {
    pool
      .getConnection()
      .then((connection) => {
        app.locals.dbConnection = connection;
        next();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
      });
  } else {
    next();
  }
});

// Ruta GET: /productos
app.get('/productos', async (req, res) => {
  try {
    const rows = await app.locals.dbConnection.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Ruta POST: /productos
app.post('/productos', async (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) {
    res.status(400).json({ error: 'Se requiere nombre y precio del producto' });
  } else {
    try {
      await app.locals.dbConnection.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
      const insertedProduct = {nombre, precio };
      res.json(insertedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
});

app.listen(app.get('port'), () => {
  console.log(`API escuchando en http://localhost:${app.get('port')}`);
});
