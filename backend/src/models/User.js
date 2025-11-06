import pool from "../config/db.js";

class User {
  // 🔹 Crear un nuevo usuario
  static async create(userData) {
    const { name, phone, email, role, lat, lng, firebase_uid } = userData;
    const query = `
      INSERT INTO users (name, phone, email, role, lat, lng, firebase_uid)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, phone, email, role, lat, lng, firebase_uid, created_at
    `;
    const values = [name, phone, email, role, lat, lng, firebase_uid];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 🔹 Buscar usuario por ID
  static async findById(id) {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 🔹 Buscar usuario por teléfono
  static async findByPhone(phone) {
    const query = "SELECT * FROM users WHERE phone = $1";
    const result = await pool.query(query, [phone]);
    return result.rows[0];
  }

  // 🔹 Buscar usuario por Firebase UID
  static async findByFirebaseUid(uid) {
    const query = "SELECT * FROM users WHERE firebase_uid = $1";
    const result = await pool.query(query, [uid]);
    return result.rows[0];
  }

  // 🔹 Crear o actualizar usuario si existe
  static async upsertByFirebaseUid(userData) {
    const { firebase_uid, name, email, phone, role } = userData;
    const query = `
      INSERT INTO users (firebase_uid, name, email, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (firebase_uid)
      DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone
      RETURNING *;
    `;
    const result = await pool.query(query, [
      firebase_uid,
      name,
      email,
      phone,
      role || "cliente",
    ]);
    return result.rows[0];
  }

  // 🔹 Actualizar ubicación
  static async updateLocation(id, lat, lng) {
    const query =
      "UPDATE users SET lat = $1, lng = $2 WHERE id = $3 RETURNING *";
    const result = await pool.query(query, [lat, lng, id]);
    return result.rows[0];
  }
}

export default User;
