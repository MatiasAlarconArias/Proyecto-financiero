// controllers/Category.controller.js

const Category = require('../models/Category.model');

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const { name, type, icon, color } = req.body;
    const userId = req.user?.id || req.body.userId; // desde token o body

    // Validar duplicados por usuario
    const exists = await Category.findOne({ userId, name, type });
    if (exists) {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre y tipo' });
    }

    const category = new Category({ userId, name, type, icon, color });
    await category.save();
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear la categoría',
      error: error.message,
    });
  }
};

// Listar todas las categorías de un usuario
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    const categories = await Category.find({ userId }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener categorías',
      error: error.message,
    });
  }
};

// Obtener categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la categoría',
      error: error.message,
    });
  }
};

// Actualizar categoría
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, icon, color } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, type, icon, color },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar la categoría',
      error: error.message,
    });
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar la categoría',
      error: error.message,
    });
  }
};
