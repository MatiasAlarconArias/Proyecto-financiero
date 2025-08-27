const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    amount: { type: Number, required: true },
    period: {
      type: String,
      enum: ['Mensual', 'Anual'],
      required: true,
    },
    spent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['En buen camino', 'Excedido'],
      default: 'En buen camino',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
