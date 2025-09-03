// controllers/transaction.controller.js
const Transaction = require('../models/transaction.model');
const Account = require('../models/Account.model');
const Category = require('../models/Category.model');

// Crear transacción
const createTransaction = async (req, res) => {
  try {
    const { accountId, type, categoryId, description, amount, date } = req.body;
    const userId = req.user.id;

    // validar cuenta
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });

    // validar categoría
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });

    // crear transacción
    const transaction = new Transaction({
      accountId,
      userId,
      type,
      categoryId,
      description,
      amount,
      date,
    });
    await transaction.save();

    // actualizar balance
    if (type === 'Ingreso') account.balance += amount;
    if (type === 'Gasto') account.balance -= amount;
    await account.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener transacciones (con filtros)
const getTransactions = async (req, res) => {
  try {
    const filters = { userId: req.user.id };

    if (req.query.accountId) filters.accountId = req.query.accountId;
    if (req.query.categoryId) filters.categoryId = req.query.categoryId;
    if (req.query.type) filters.type = req.query.type;

    if (req.query.startDate && req.query.endDate) {
      filters.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const transactions = await Transaction.find(filters)
      .populate('categoryId', 'name type')
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener transacción por ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate('categoryId', 'name type');

    if (!transaction) return res.status(404).json({ message: 'No encontrada' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar transacción
const updateTransaction = async (req, res) => {
  try {
    const { description, categoryId, amount } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!transaction) return res.status(404).json({ message: 'No encontrada' });

    const account = await Account.findById(transaction.accountId);

    // revertir saldo previo
    if (transaction.type === 'Ingreso') account.balance -= transaction.amount;
    if (transaction.type === 'Gasto') account.balance += transaction.amount;

    if (description) transaction.description = description;
    if (categoryId) transaction.categoryId = categoryId;
    if (amount) transaction.amount = amount;

    await transaction.save();

    // aplicar nuevo saldo
    if (transaction.type === 'Ingreso') account.balance += transaction.amount;
    if (transaction.type === 'Gasto') account.balance -= transaction.amount;
    await account.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar transacción
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!transaction) return res.status(404).json({ message: 'No encontrada' });

    const account = await Account.findById(transaction.accountId);

    if (transaction.type === 'Ingreso') account.balance -= transaction.amount;
    if (transaction.type === 'Gasto') account.balance += transaction.amount;
    await account.save();

    await transaction.deleteOne();
    res.json({ message: 'Transacción eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resumen para dashboard
const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    let filters = { userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filters.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(filters);

    const totalIncome = transactions
      .filter((t) => t.type === 'Ingreso')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'Gasto')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, netBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};
