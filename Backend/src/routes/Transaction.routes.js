const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { authenticateToken } = require('../middlewares/auth.middlewares');

// ======================
// CRUD de transacciones
// ======================
router.post('/', authenticateToken, transactionController.createTransaction);
router.get('/', authenticateToken, transactionController.getTransactions);
router.get('/:id', authenticateToken, transactionController.getTransactionById);
router.put('/:id', authenticateToken, transactionController.updateTransaction);
router.delete('/:id', authenticateToken, transactionController.deleteTransaction);

// ======================
// Rutas para dashboard
// ======================
router.get('/summary/month', authenticateToken, transactionController.getTransactionSummary);
router.get('/stats/monthly-trends', authenticateToken, transactionController.getMonthlyTrends);
router.get('/stats/expenses-by-category', authenticateToken, transactionController.getExpensesByCategory);

module.exports = router;
