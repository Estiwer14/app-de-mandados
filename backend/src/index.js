import "./firebase.js"; // Inicializa Firebase Admin
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import db from "./config/db.js";

const app = express();
const PORT = 3000;

// ✅ Configurar CORS para permitir peticiones desde Expo / emuladores / móviles
app.use(
  cors({
    origin: "*", // Permitir cualquier origen (solo para desarrollo)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware para parsear JSON
app.use(express.json());

// ✅ Conectar rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Ruta de prueba para verificar conexión
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend conectado correctamente ✅" });
});

// ✅ Levantar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor escuchando en http://0.0.0.0:${PORT}`);
});
