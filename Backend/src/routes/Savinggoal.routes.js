const express = require('express');
const router = express.Router();
const savinggoalController = require('../controllers/Savinggoal.controller');
const { authenticateToken } = require('../middlewares/auth.middlewares');

// =======================
// CRUD de metas de ahorro
// =======================
router.post('/', authenticateToken, savinggoalController.createSavingGoal);
router.get('/user/:userId', authenticateToken, savinggoalController.getSavingGoalsByUser);
router.get('/:id', authenticateToken, savinggoalController.getSavingGoalById);
router.put('/:id', authenticateToken, savinggoalController.updateSavingGoal);
router.delete('/:id', authenticateToken, savinggoalController.deleteSavingGoal);

// =======================
// Operaciones adicionales
// =======================
router.post('/:id/add', authenticateToken, savinggoalController.addMoney);
router.post('/:id/withdraw', authenticateToken, savinggoalController.withdrawMoney);
router.get('/:id/progress', authenticateToken, savinggoalController.getProgress);
router.get('/stats/:userId', authenticateToken, savinggoalController.getUserSavingStats);

module.exports = router;
