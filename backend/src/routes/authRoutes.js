import express from "express";
import {
  registerWithFirebase,
  loginWithFirebase,
} from "../controllers/authController.js";

const router = express.Router();

// Registro e inicio de sesión con Firebase
router.post("/register", registerWithFirebase);
router.post("/login", loginWithFirebase);

export default router;
