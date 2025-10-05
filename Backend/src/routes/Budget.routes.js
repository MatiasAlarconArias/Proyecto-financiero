const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/Budget.controller');
const { authenticateToken } = require('../middlewares/auth.middlewares');

// =======================
// CRUD de Presupuestos
// =======================
router.post('/', authenticateToken, budgetController.createBudget);
router.get('/', authenticateToken, budgetController.getBudgets);
router.get('/:id', authenticateToken, budgetController.getBudgetById);
router.put('/:id', authenticateToken, budgetController.updateBudget);
router.delete('/:id', authenticateToken, budgetController.deleteBudget);

module.exports = router;
