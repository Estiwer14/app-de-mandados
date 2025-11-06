import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  updateLocation,
  getProfile,
  getNearbyMandaderos,
  createUserFromFirebase, // ✅ Asegúrate de que esté importado
} from "../controllers/userController.js";

const router = express.Router();

// ✅ Nueva ruta: registrar usuario desde Firebase
router.post("/firebase-register", createUserFromFirebase);

// ✅ Ruta protegida: obtener perfil del usuario autenticado
router.get("/me", authenticate, getProfile);

// ✅ Ruta protegida: actualizar ubicación del usuario
router.put("/location", authenticate, updateLocation);

// ✅ Ruta protegida: obtener mandaderos cercanos
router.get("/nearby-mandaderos", authenticate, getNearbyMandaderos);

export default router;
