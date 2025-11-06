import admin from "../firebase.js";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado." });
    }

    const idToken = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Buscar el usuario en Postgres por el UID de Firebase
    const user = await User.findByFirebaseUid(decoded.uid);

    if (!user) {
      console.log("❌ Usuario no encontrado en la base de datos:", decoded.uid);
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Guardar usuario en la request para las rutas siguientes
    req.user = user;

    next();
  } catch (error) {
    console.error("Error en autenticación:", error);
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};
