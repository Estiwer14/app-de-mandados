// src/routes/auth.ts
import { Router } from "express";
import { prisma } from "../prisma";
import { signSession } from "../services/jwt";
import * as admin from "firebase-admin";

const router = Router();

// --- Login por teléfono ---
router.post("/login-phone", async (req, res) => {
  try {
    const { firebaseIdToken } = req.body;
    if (!firebaseIdToken)
      return res.status(400).json({ error: "MISSING_TOKEN" });

    // Verificar token con Firebase Admin
    const decoded = await admin.auth().verifyIdToken(firebaseIdToken);
    const phone = decoded.phone_number;

    if (!phone) return res.status(400).json({ error: "NO_PHONE_IN_TOKEN" });

    // Buscar o crear usuario
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: "CLIENT", // por defecto, cliente
        },
      });
    }

    // Crear token propio de tu API
    const jwt = signSession({ userId: user.id, role: user.role });

    return res.json({
      token: jwt,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error en /login-phone:", error);
    return res
      .status(401)
      .json({ error: "INVALID_FIREBASE_TOKEN", details: error.message });
  }
});

export default router;
