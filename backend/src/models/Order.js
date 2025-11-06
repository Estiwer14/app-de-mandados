import pool from "../config/db.js";

class Order {
  static async create(orderData) {
    const {
      client_id,
      pickup_address,
      delivery_address,
      description,
      price,
      distance_km,
      estimated_time_minutes,
    } = orderData;

    const query = `
      INSERT INTO orders (
        client_id, pickup_address, delivery_address, description, price, distance_km, estimated_time_minutes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      client_id,
      pickup_address,
      delivery_address,
      description,
      price,
      distance_km,
      estimated_time_minutes,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT o.*, c.name AS client_name, m.name AS mandadero_name
      FROM orders o
      LEFT JOIN users c ON o.client_id = c.id
      LEFT JOIN users m ON o.mandadero_id = m.id
      WHERE o.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getPendingOrders() {
    const query = `
      SELECT * FROM orders
      WHERE status = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, ["pendiente"]);
    return result.rows;
  }

  static async acceptOrder(orderId, mandaderoId) {
    const query = `
      UPDATE orders
      SET mandadero_id = $1, status = 'aceptado', updated_at = NOW()
      WHERE id = $2 AND status = 'pendiente'
      RETURNING *;
    `;
    const result = await pool.query(query, [mandaderoId, orderId]);
    return result.rows[0];
  }

  static async startOrder(orderId) {
    const query = `
      UPDATE orders
      SET status = 'en_ruta', updated_at = NOW()
      WHERE id = $1 AND status = 'aceptado'
      RETURNING *;
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows[0];
  }

  static async deliverOrder(orderId) {
    const query = `
      UPDATE orders
      SET status = 'entregado', updated_at = NOW()
      WHERE id = $1 AND status = 'en_ruta'
      RETURNING *;
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows[0];
  }
}

export default Order;
