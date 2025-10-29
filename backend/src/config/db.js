import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Intentar reconectar varias veces
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await pool.connect();
      console.log("✅ Conectado a PostgreSQL exitosamente");
      break;
    } catch (err) {
      console.log(
        `❌ Error conectando a PostgreSQL: ${err}. Reintentando... (${retries})`
      );
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000)); // Esperar 5 segundos
    }
  }
};

connectWithRetry();

export default pool;
