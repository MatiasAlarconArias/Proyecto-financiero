const Budget = require('../models/Budget.model');

const computeStatus = (amount, spent) => (spent > amount ? 'Excedido' : 'En buen camino');

exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'No autenticado' });

    const budgets = await Budget.find({ userId }).populate('categoryId', 'name type').exec();
    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener presupuestos', error: error.message });
  }
};

exports.getBudgetById = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'No autenticado' });

    const { id } = req.params;
    const budget = await Budget.findOne({ _id: id, userId })
      .populate('categoryId', 'name type')
      .exec();

    if (!budget) return res.status(404).json({ message: 'Presupuesto no encontrado' });
    return res.status(200).json(budget);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'ID inválido' });
    return res
      .status(500)
      .json({ message: 'Error al obtener el presupuesto', error: error.message });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'No autenticado' });

    const { categoryId, amount, period, spent = 0 } = req.body;

    if (!categoryId || amount == null || !period) {
      return res
        .status(400)
        .json({ message: 'Faltan campos requeridos: categoryId, amount, period' });
    }

    const amountNum = Number(amount);
    const spentNum = Number(spent);

    if (Number.isNaN(amountNum) || amountNum < 0)
      return res.status(400).json({ message: 'Amount inválido' });
    if (Number.isNaN(spentNum) || spentNum < 0)
      return res.status(400).json({ message: 'Spent inválido' });
    if (!['Mensual', 'Anual'].includes(period))
      return res.status(400).json({ message: 'Period inválido' });

    const status = computeStatus(amountNum, spentNum);

    const newBudget = new Budget({
      userId,
      categoryId,
      amount: amountNum,
      period,
      spent: spentNum,
      status,
    });
    const saved = await newBudget.save();

    const populated = await Budget.findById(saved._id).populate('categoryId', 'name type').exec();
    return res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    return res.status(500).json({ message: 'Error al crear el presupuesto', error: error.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'No autenticado' });

    const { id } = req.params;
    const { categoryId, amount, period, spent } = req.body;

    const budget = await Budget.findOne({ _id: id, userId });
    if (!budget) return res.status(404).json({ message: 'Presupuesto no encontrado' });

    if (categoryId !== undefined) budget.categoryId = categoryId;
    if (amount !== undefined) {
      const amountNum = Number(amount);
      if (Number.isNaN(amountNum) || amountNum < 0)
        return res.status(400).json({ message: 'Amount inválido' });
      budget.amount = amountNum;
    }
    if (period !== undefined) {
      if (!['Mensual', 'Anual'].includes(period))
        return res.status(400).json({ message: 'Period inválido' });
      budget.period = period;
    }
    if (spent !== undefined) {
      const spentNum = Number(spent);
      if (Number.isNaN(spentNum) || spentNum < 0)
        return res.status(400).json({ message: 'Spent inválido' });
      budget.spent = spentNum;
    }

    budget.status = computeStatus(budget.amount, budget.spent);

    const updated = await budget.save();
    const populated = await Budget.findById(updated._id).populate('categoryId', 'name type').exec();
    return res.status(200).json(populated);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'ID inválido' });
    return res
      .status(500)
      .json({ message: 'Error al actualizar el presupuesto', error: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'No autenticado' });

    const { id } = req.params;
    const deleted = await Budget.findOneAndDelete({ _id: id, userId });

    if (!deleted) return res.status(404).json({ message: 'Presupuesto no encontrado' });
    return res.status(200).json({ message: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'ID inválido' });
    return res
      .status(500)
      .json({ message: 'Error al eliminar el presupuesto', error: error.message });
  }
};
