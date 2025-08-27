const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['Ingreso', 'Gasto', 'Transferencia'],
      required: true,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String, trim: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // solo createdAt
);

module.exports = mongoose.model('Transaction', transactionSchema);
