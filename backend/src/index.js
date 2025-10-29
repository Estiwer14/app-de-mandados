import express from "express";
import dotenv from "dotenv";
import pool from "./config/db.js";

// Cargar variables de entorno
dotenv.config();

// Inicializar app
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Puerto del servidor
const PORT = process.env.PORT || 4000;

// Ruta de prueba del servidor
app.get("/", (req, res) => {
  res.send(
    "🚀 Servidor Express + PostgreSQL + PostGIS funcionando correctamente"
  );
});

// Ruta de prueba de conexión con la base de datos
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      message: "✅ Conexión exitosa con la base de datos",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("❌ Error al ejecutar consulta:", error);
    res.status(500).json({
      message: "Error al conectar con la base de datos",
      error: error.message,
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
