const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser'); // ⬅️ Necesario para leer cookies
const authRoutes = require('./routes/auth.routes');

const app = express();

// ✅ Middleware para aceptar JSON
app.use(express.json());

// ✅ Middleware para aceptar cookies
app.use(cookieParser());

// ✅ Middleware para aceptar solicitudes desde el frontend
app.use(
  cors({
    origin: 'http://localhost:5173', // Reemplaza si usas otro puerto en el frontend
    credentials: true,
  })
);

// ✅ Middleware de logs
app.use(morgan('dev'));

// ✅ Rutas de la API

app.use('/api/auth', authRoutes);

// ✅ Conexión a la base de datos
connectDB();

module.exports = app;
