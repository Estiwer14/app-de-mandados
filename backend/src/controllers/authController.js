const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

const register = async (req, res) => {
  try {
    const { name, phone, email, role } = req.body;

    // Verificar si ya existe el usuario
    const existingUser = await User.findByPhone(phone);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario ya registrado.' });
    }

    const newUser = await User.create({
      name,
      phone,
      email,
      role,
      lat: null,
      lng: null
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        lat: newUser.lat,
        lng: newUser.lng
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findByPhone(phone);
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login exitoso.',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        lat: user.lat,
        lng: user.lng
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };