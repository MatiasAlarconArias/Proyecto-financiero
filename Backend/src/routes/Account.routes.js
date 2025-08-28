// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');
// ⚠️ este middleware debería validar el JWT y meter req.user.id

// =======================
// CRUD de cuentas
// =======================
router.post('/', authMiddleware, accountController.createAccount);
router.get('/', authMiddleware, accountController.getAccounts);
router.get('/:id', authMiddleware, accountController.getAccountById);
router.put('/:id', authMiddleware, accountController.updateAccount);
router.delete('/:id', authMiddleware, accountController.deleteAccount);

// =======================
// Rutas para dashboard
// =======================
router.get('/totals/non-credit', authMiddleware, accountController.getTotalNonCreditBalance);
router.get('/totals/credit', authMiddleware, accountController.getTotalCreditDebt);
router.get('/totals/net-worth', authMiddleware, accountController.getNetWorth);
router.get('/totals/all', authMiddleware, accountController.getTotalBalance);

module.exports = router;
