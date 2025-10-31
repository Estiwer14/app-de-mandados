const Order = require('../models/Order');
const User = require('../models/User');

const createOrder = async (req, res) => {
  try {
    const { pickup_address, delivery_address, description, price, distance_km, estimated_time_minutes } = req.body;
    const client_id = req.user.id;

    const newOrder = await Order.create({
      client_id,
      pickup_address,
      delivery_address,
      description,
      price,
      distance_km,
      estimated_time_minutes
    });

    res.status(201).json({
      message: 'Pedido creado exitosamente.',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.getPendingOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const mandaderoId = req.user.id;

    const order = await Order.acceptOrder(id, mandaderoId);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado o ya aceptado.' });
    }

    res.json({
      message: 'Pedido aceptado exitosamente.',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const startOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.startOrder(id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado o estado inválido.' });
    }

    res.json({
      message: 'Pedido iniciado.',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.deliverOrder(id);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado o estado inválido.' });
    }

    res.json({
      message: 'Pedido entregado exitosamente.',
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getPendingOrders,
  acceptOrder,
  startOrder,
  deliverOrder
};