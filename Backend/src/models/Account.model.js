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
    number: { type: String, unique: true, required: true }, // generado automáticamente
    balance: { type: Number, default: 0 },

    // Solo aplica si type = "Crédito"
    creditLimit: { type: Number },
    availableCredit: { type: Number },

    // Nombre del banco (agregado para tu app)
    bankName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
