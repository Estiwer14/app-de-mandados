// backend/src/controllers/userController.js
const User = require('../models/User');
const Location = require('../models/Location');

// Actualizar ubicación del usuario autenticado
const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const userId = req.user.id;

    if (lat == null || lng == null) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridas.' });
    }

    // Actualizar en tabla users (para tener siempre la última posición visible)
    const updatedUser = await User.updateLocation(userId, lat, lng);

    // Guardar en historial de ubicaciones
    await Location.saveLocation(userId, lat, lng);

    res.json({
      message: 'Ubicación actualizada exitosamente.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({ error: 'Error al actualizar la ubicación.' });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener mandaderos cercanos (últimas ubicaciones activas)
const getNearbyMandaderos = async (req, res) => {
  try {
    const mandaderos = await Location.getRecentLocations(10); // últimos 10 minutos
    res.json(mandaderos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mandaderos cercanos.' });
  }
};

module.exports = {
  updateLocation,
  getProfile,
  getNearbyMandaderos
};