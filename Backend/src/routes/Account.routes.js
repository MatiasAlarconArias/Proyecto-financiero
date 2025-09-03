const express = require('express');
const router = express.Router();
const accountController = require('../controllers/Account.controller');
const { authenticateToken } = require('../middlewares/auth.middlewares');

// =======================
// CRUD de cuentas
// =======================
router.post('/', authenticateToken, accountController.createAccount);
router.get('/', authenticateToken, accountController.getAccounts);
router.get('/:id', authenticateToken, accountController.getAccountById);
router.put('/:id', authenticateToken, accountController.updateAccount);
router.delete('/:id', authenticateToken, accountController.deleteAccount);

// =======================
// Rutas para dashboard
// =======================
router.get('/totals/non-credit', authenticateToken, accountController.getTotalNonCreditBalance);
router.get('/totals/credit', authenticateToken, accountController.getTotalCreditDebt);
router.get('/totals/net-worth', authenticateToken, accountController.getNetWorth);
router.get('/totals/all', authenticateToken, accountController.getTotalBalance);

module.exports = router;
