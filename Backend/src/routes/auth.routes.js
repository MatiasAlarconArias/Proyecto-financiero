const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  logoutUser,
  getLoggedUser,
} = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middlewares');

// =======================
// Rutas de autenticación
// =======================
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// =======================
// Ruta para obtener usuario logeado
// =======================
router.get('/me', authenticateToken, getLoggedUser);

module.exports = router;
