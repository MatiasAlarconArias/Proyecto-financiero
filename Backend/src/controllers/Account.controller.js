// controllers/accountController.js
const Account = require('../models/Account.model');

// =======================
// CRUD de cuentas
// =======================

// Crear cuenta
exports.createAccount = async (req, res) => {
  try {
    const { type, currency, number, balance, creditLimit, availableCredit, bankName } = req.body;

    if (type === 'Crédito') {
      if (!creditLimit || !availableCredit) {
        return res
          .status(400)
          .json({ message: 'Los campos de crédito son obligatorios para cuentas de tipo Crédito' });
      }
    }

    const account = new Account({
      userId: req.user.id,
      type,
      currency,
      number,
      balance,
      creditLimit,
      availableCredit,
      bankName,
    });

    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cuenta', error: error.message });
  }
};

// Obtener todas las cuentas del usuario
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cuentas', error: error.message });
  }
};

// Obtener una cuenta por ID
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, userId: req.user.id });
    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cuenta', error: error.message });
  }
};

// Actualizar cuenta
exports.updateAccount = async (req, res) => {
  try {
    const { type, creditLimit, availableCredit } = req.body;

    if (type === 'Crédito') {
      if (!creditLimit || !availableCredit) {
        return res
          .status(400)
          .json({ message: 'Los campos de crédito son obligatorios para cuentas de tipo Crédito' });
      }
    }

    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cuenta', error: error.message });
  }
};

// Eliminar cuenta
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cuenta', error: error.message });
  }
};

// =======================
// Funciones para dashboard
// =======================

// Activos Totales (todas las cuentas excepto crédito)
exports.getTotalNonCreditBalance = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id, type: { $ne: 'Crédito' } });
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    res.json({ totalBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error al calcular activos totales', error: error.message });
  }
};

// Deudas Totales (solo cuentas de crédito)
exports.getTotalCreditDebt = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id, type: 'Crédito' });
    const totalDebt = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    res.json({ totalDebt });
  } catch (error) {
    res.status(500).json({ message: 'Error al calcular deudas totales', error: error.message });
  }
};

// Patrimonio Neto = Activos - Deudas
exports.getNetWorth = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });

    const activos = accounts
      .filter((acc) => acc.type !== 'Crédito')
      .reduce((sum, acc) => sum + acc.balance, 0);

    const deudas = accounts
      .filter((acc) => acc.type === 'Crédito')
      .reduce((sum, acc) => sum + (acc.balance || 0), 0);

    const patrimonioNeto = activos - deudas;
    res.json({ patrimonioNeto, activos, deudas });
  } catch (error) {
    res.status(500).json({ message: 'Error al calcular patrimonio neto', error: error.message });
  }
};

// Saldo Total (todas las cuentas)
exports.getTotalBalance = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    res.json({ totalBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error al calcular saldo total', error: error.message });
  }
};
