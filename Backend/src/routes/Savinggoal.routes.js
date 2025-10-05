const express = require('express');
const router = express.Router();
const savinggoalController = require('../controllers/Savinggoal.controller');
const { authenticateToken } = require('../middlewares/auth.middlewares');

// =======================
// CRUD de metas de ahorro
// =======================
router.post('/', authenticateToken, savinggoalController.createSavinggoal);
router.get('/', authenticateToken, savinggoalController.getSavinggoals);
router.get('/:id', authenticateToken, savinggoalController.getSavinggoalById);
router.put('/:id', authenticateToken, savinggoalController.updateSavinggoal);
router.delete('/:id', authenticateToken, savinggoalController.deleteSavinggoal);

module.exports = router;
