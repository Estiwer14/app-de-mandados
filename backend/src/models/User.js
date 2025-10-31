const pool = require('../config/db');

class User {
  static async create(userData) {
    const { name, phone, email, role, lat, lng } = userData;
    const query = `
      INSERT INTO users (name, phone, email, role, lat, lng)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, phone, email, role, lat, lng, created_at
    `;
    const values = [name, phone, email, role, lat, lng];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await pool.query(query, [phone]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateLocation(id, lat, lng) {
    const query = 'UPDATE users SET lat = $1, lng = $2 WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [lat, lng, id]);
    return result.rows[0];
  }
}

module.exports = User;