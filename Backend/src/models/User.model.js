const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true }, // aquí guardarás el hash con bcrypt
    phone: { type: String, default: null },
  },
  { timestamps: true } // crea createdAt y updatedAt automáticamente
);

module.exports = mongoose.model('User', userSchema);
