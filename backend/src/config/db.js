import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "mandadito",
  port: process.env.DB_PORT || 5432,
});

pool.on("connect", () => {
  console.log("✅ Conectado a la base de datos PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Error en la conexión de PostgreSQL:", err);
});

export default pool;
