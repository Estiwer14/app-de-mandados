// backend/src/models/Location.js
const pool = require('../config/db');

class Location {
  // Guarda o actualiza la ubicación del usuario
  static async saveLocation(userId, lat, lng) {
    const query = `
      INSERT INTO locations (user_id, lat, lng, timestamp)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, lat, lng]);
    return result.rows[0];
  }

  // Obtiene la última ubicación conocida de un usuario
  static async getLastLocationByUser(userId) {
    const query = `
      SELECT * FROM locations
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT 1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  // Obtiene todas las ubicaciones recientes (últimos 5 minutos, por ejemplo)
  static async getRecentLocations(minutes = 5) {
    const query = `
      SELECT u.id, u.name, u.role, l.lat, l.lng, l.timestamp
      FROM locations l
      JOIN users u ON l.user_id = u.id
      WHERE l.timestamp >= NOW() - INTERVAL '${minutes} minutes'
      AND u.role = 'mandadero';
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Location;