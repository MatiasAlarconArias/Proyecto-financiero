const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['Corriente', 'Ahorros', 'Crédito', 'Inversión'],
      required: true,
    },
    currency: {
      type: String,
      enum: ['CLP', 'USD'],
      required: true,
    },
    number: { type: String, unique: true, required: true }, // puedes generarlo automáticamente
    balance: { type: Number, default: 0 },

    // Solo aplica si type = "Crédito"
    creditLimit: { type: Number },
    availableCredit: { type: Number },
    statementCloseDay: { type: Number, min: 1, max: 28 },
    paymentDueDay: { type: Number, min: 1, max: 28 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
