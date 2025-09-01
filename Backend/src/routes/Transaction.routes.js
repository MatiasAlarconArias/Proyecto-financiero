// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// ⚠️ este middleware debería validar el JWT y meter req.user.id

// ======================
// CRUD de transacciones
// ======================
router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/', authMiddleware, transactionController.getTransactions);
router.get('/:id', authMiddleware, transactionController.getTransactionById);
router.put('/:id', authMiddleware, transactionController.updateTransaction);
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);

// ======================
// Rutas para dashboard
// ======================
router.get('/summary/month', authMiddleware, transactionController.getTransactionSummary);

module.exports = router;
