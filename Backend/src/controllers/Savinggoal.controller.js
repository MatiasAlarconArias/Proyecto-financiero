const Savinggoal = require('../models/Savinggoal.model');

// Crear una nueva meta de ahorro
exports.createSavingGoal = async (req, res) => {
  try {
    const { userId, name, targetAmount, currentAmount, deadline } = req.body;
    const newSavingGoal = new Savinggoal({
      userId,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
    });
    await newSavingGoal.save();
    res.status(201).json({ message: 'Saving goal created successfully', data: newSavingGoal });
  } catch (error) {
    console.error('Error creating saving goal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener todas las metas de ahorro de un usuario
exports.getSavingGoalsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const savingGoals = await Savinggoal.find({ userId });
    res.status(200).json({ data: savingGoals });
  } catch (error) {
    console.error('Error fetching saving goals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener una meta de ahorro específica por ID
exports.getSavingGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const savingGoal = await Savinggoal.findById(id);

    if (!savingGoal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }

    res.status(200).json({ data: savingGoal });
  } catch (error) {
    console.error('Error fetching saving goal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Actualizar una meta de ahorro
exports.updateSavingGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, targetAmount, currentAmount, deadline } = req.body;

    const updatedSavingGoal = await Savinggoal.findByIdAndUpdate(
      id,
      { name, targetAmount, currentAmount, deadline },
      { new: true }
    );

    if (!updatedSavingGoal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }

    res.status(200).json({ message: 'Saving goal updated successfully', data: updatedSavingGoal });
  } catch (error) {
    console.error('Error updating saving goal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Eliminar una meta de ahorro
exports.deleteSavingGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSavingGoal = await Savinggoal.findByIdAndDelete(id);

    if (!deletedSavingGoal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }

    res.status(200).json({ message: 'Saving goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting saving goal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Agregar dinero a una meta de ahorro
exports.addMoney = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const savingGoal = await Savinggoal.findById(id);

    if (!savingGoal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }

    savingGoal.currentAmount += amount;
    await savingGoal.save();

    res.status(200).json({
      message: 'Money added successfully',
      data: savingGoal,
      progress: (savingGoal.currentAmount / savingGoal.targetAmount) * 100,
    });
  } catch (error) {
    console.error('Error adding money:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Retirar dinero de una meta de ahorro
exports.withdrawMoney = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const savingGoal = await Savinggoal.findById(id);

    if (!savingGoal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }

    if (savingGoal.currentAmount < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    savingGoal.currentAmount -= amount;
    await savingGoal.save();

    res.status(200).json({
      message: 'Money withdrawn successfully',
      data: savingGoal,
      progress: (savingGoal.currentAmount / savingGoal.targetAmount) * 100,
    });
  } catch (error) {
    console.error('Error withdrawing money:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener el progreso de una meta de ahorro
exports.getProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const savingGoal = await Savinggoal.findById(id);

    if (!savingGoal) {
      return res.status(404).json({ message: 'Saving goal not found' });
    }

    const progress = (savingGoal.currentAmount / savingGoal.targetAmount) * 100;
    const remainingAmount = savingGoal.targetAmount - savingGoal.currentAmount;
    const isCompleted = progress >= 100;

    // Calcular días restantes hasta el deadline
    const today = new Date();
    const deadline = new Date(savingGoal.deadline);
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    res.status(200).json({
      data: {
        savingGoal,
        progress: Math.min(progress, 100),
        remainingAmount: Math.max(remainingAmount, 0),
        isCompleted,
        daysRemaining,
        isOverdue: daysRemaining < 0,
      },
    });
  } catch (error) {
    console.error('Error calculating progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener estadísticas de todas las metas de un usuario
exports.getUserSavingStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const savingGoals = await Savinggoal.find({ userId });

    const totalGoals = savingGoals.length;
    const completedGoals = savingGoals.filter(
      (goal) => goal.currentAmount >= goal.targetAmount
    ).length;
    const totalTargetAmount = savingGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrentAmount = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const overallProgress =
      totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

    res.status(200).json({
      data: {
        totalGoals,
        completedGoals,
        activeGoals: totalGoals - completedGoals,
        totalTargetAmount,
        totalCurrentAmount,
        overallProgress: Math.min(overallProgress, 100),
        completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      },
    });
  } catch (error) {
    console.error('Error getting saving stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
