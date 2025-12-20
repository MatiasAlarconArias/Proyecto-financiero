// controllers/transaction.controller.js
const mongoose = require('mongoose');
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

    // Actualizar balance según tipo de cuenta
    if (account.type === 'Crédito') {
      if (type === 'Gasto') {
        const newBalance = account.balance + amount;
        // Validar límite de crédito si existe
        if (account.creditLimit && newBalance > account.creditLimit) {
           return res.status(400).json({ message: 'El gasto excede el límite de crédito disponible.' });
        }
        account.balance = newBalance;
      } else if (type === 'Ingreso') {
          // Pago de tarjeta (reduce la deuda) - Validar que no pague más de lo que debe
          if (account.balance - amount < 0) {
             return res.status(400).json({ message: 'El pago excede la deuda actual.' });
          }
          account.balance -= amount;
      }
      
      // Recalcular crédito disponible
      if (account.creditLimit !== undefined) {
          account.availableCredit = account.creditLimit - account.balance;
      }

    } else {
        // Cuentas normales (Corriente, Ahorros, Inversión)
        if (type === 'Ingreso') account.balance += amount;
        if (type === 'Gasto') account.balance -= amount;
    }
    
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

    // Lógica para revertir saldo previo
    if (account.type === 'Crédito') {
      if (transaction.type === 'Ingreso') account.balance += transaction.amount; // Devolver el pago (aumenta deuda)
      if (transaction.type === 'Gasto') account.balance -= transaction.amount;   // Quitar el gasto (baja deuda)
    } else {
      // Cuentas normales
      if (transaction.type === 'Ingreso') account.balance -= transaction.amount;
      if (transaction.type === 'Gasto') account.balance += transaction.amount;
    }

    if (description) transaction.description = description;
    if (categoryId) transaction.categoryId = categoryId;
    if (amount) transaction.amount = amount;

    await transaction.save();

    // Lógica para aplicar nuevo saldo
    if (account.type === 'Crédito') {
      if (transaction.type === 'Gasto') {
        const newBalance = account.balance + transaction.amount;
        if (account.creditLimit && newBalance > account.creditLimit) {
           return res.status(400).json({ message: 'El gasto actualizado excede el límite de crédito.' });
        }
        account.balance = newBalance;
      } else if (transaction.type === 'Ingreso') {
         if (account.balance - transaction.amount < 0) {
             return res.status(400).json({ message: 'El pago actualizado excede la deuda actual.' });
         }
         account.balance -= transaction.amount;
      }
      
      if (account.creditLimit !== undefined) {
          account.availableCredit = account.creditLimit - account.balance;
      }
    } else {
       // Cuentas normales
       if (transaction.type === 'Ingreso') account.balance += transaction.amount;
       if (transaction.type === 'Gasto') account.balance -= transaction.amount;
    }
    
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

    if (account.type === 'Crédito') {
        // Revertir en cuenta de crédito
        if (transaction.type === 'Ingreso') account.balance += transaction.amount; // Revertir pago -> Aumenta deuda
        if (transaction.type === 'Gasto') account.balance -= transaction.amount;   // Revertir gasto -> Baja deuda

        if (account.creditLimit !== undefined) {
          account.availableCredit = account.creditLimit - account.balance;
        }
    } else {
        // Cuentas normales
        if (transaction.type === 'Ingreso') account.balance -= transaction.amount;
        if (transaction.type === 'Gasto') account.balance += transaction.amount;
    }
    
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

// Tendencias mensuales (últimos 6 meses)
const getMonthlyTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    // 5 meses atrás + mes actual = 6 meses
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Formatear datos para el frontend
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const formattedData = [];

    // Generar últimos 6 meses vacíos para rellenar
    for (let i = 0; i < 6; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
        const monthIndex = d.getMonth();
        const year = d.getFullYear();
        const monthName = months[monthIndex];
        
        const incomeStat = stats.find(s => s._id.month === monthIndex + 1 && s._id.year === year && s._id.type === 'Ingreso');
        const expenseStat = stats.find(s => s._id.month === monthIndex + 1 && s._id.year === year && s._id.type === 'Gasto');

        formattedData.push({
            name: monthName,
            Ingresos: incomeStat ? incomeStat.total : 0,
            Gastos: expenseStat ? expenseStat.total : 0
        });
    }

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gastos por categoría (mes actual)
const getExpensesByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    const stats = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfMonth, $lte: endOfMonth },
          type: 'Gasto',
        },
      },
      {
        $group: {
          _id: '$categoryId',
          value: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          _id: 0,
          name: '$category.name',
          value: 1,
        },
      },
      { $sort: { value: -1 } }
    ]);

    res.json(stats);
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
  getMonthlyTrends,
  getExpensesByCategory,
};
