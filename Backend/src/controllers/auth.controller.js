const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    const userSaved = await newUser.save();

    // Generar token JWT
    const token = jwt.sign({ id: userSaved._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token);

    res.status(201).json({
      id: userSaved._id,
      firstName: userSaved.firstName,
      lastName: userSaved.lastName,
      email: userSaved.email,
      phone: userSaved.phone,
      createdAt: userSaved.createdAt,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al registrar usuario. Posiblemente el correo ya está en uso.',
        error,
      });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false, // true si usas HTTPS
    });

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

// Cerrar sesión del usuario
exports.logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
