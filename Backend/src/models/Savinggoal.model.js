const mongoose = require('mongoose');

const savingGoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    priority: {
      type: String,
      enum: ['Alta', 'Media', 'Baja'],
      default: 'Media',
    },
    deadline: { type: Date, default: null },
    status: {
      type: String,
      enum: ['En progreso', 'Completada', 'Vencida'],
      default: 'En progreso',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavingGoal', savingGoalSchema);
