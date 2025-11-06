import admin from "../firebase.js";
import User from "../models/User.js";

//
// REGISTRO CON FIREBASE AUTH (correo o número)
//
export const registerWithFirebase = async (req, res) => {
  try {
    const { idToken, name, phone } = req.body;

    if (!idToken) {
      return res
        .status(400)
        .json({ error: "Token de Firebase no proporcionado." });
    }

    // 1️⃣ Verificamos el token con Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log("🔥 Firebase token verificado:", decoded);
    const { uid, email } = decoded;

    // 2️⃣ Creamos o actualizamos el usuario en la base de datos
    const user = await User.upsertByFirebaseUid({
      firebase_uid: uid,
      name: name || decoded.name || "Sin nombre",
      email: email || null,
      phone: phone || null,
      role: "cliente",
    });

    // 3️⃣ Respuesta al cliente
    res.json({
      message: "Usuario registrado o actualizado correctamente.",
      user,
    });
  } catch (error) {
    console.error("Error en registro con Firebase:", error);
    res.status(500).json({ error: "Error en el registro con Firebase." });
  }
};

//
// LOGIN CON FIREBASE AUTH
//
export const loginWithFirebase = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res
        .status(400)
        .json({ error: "Token de Firebase no proporcionado." });
    }

    // 1️⃣ Validamos token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid } = decoded;

    // 2️⃣ Buscamos al usuario en la base de datos
    const user = await User.findByFirebaseUid(uid);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado. Regístrate primero." });
    }

    res.json({
      message: "Inicio de sesión exitoso.",
      user,
    });
  } catch (error) {
    console.error("Error en login con Firebase:", error);
    res.status(500).json({ error: "Error al iniciar sesión con Firebase." });
  }
};
