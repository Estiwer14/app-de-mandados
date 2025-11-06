import User from "../models/User.js";
import Location from "../models/Location.js";
import admin from "../firebase.js"; // 👈 Importante para verificar el token

//
// 🔹 Actualizar ubicación del usuario autenticado
//
export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const userId = req.user.id;

    if (lat == null || lng == null) {
      return res
        .status(400)
        .json({ error: "Latitud y longitud son requeridas." });
    }

    const updatedUser = await User.updateLocation(userId, lat, lng);
    await Location.saveLocation(userId, lat, lng);

    res.json({
      message: "Ubicación actualizada exitosamente.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    res.status(500).json({ error: "Error al actualizar la ubicación." });
  }
};

//
// 🔹 Obtener perfil del usuario autenticado
//
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//
// 🔹 Obtener mandaderos cercanos
//
export const getNearbyMandaderos = async (req, res) => {
  try {
    const mandaderos = await Location.getRecentLocations(10);
    res.json(mandaderos);
  } catch (error) {
    console.error("Error al obtener mandaderos cercanos:", error);
    res.status(500).json({ error: "Error al obtener mandaderos cercanos." });
  }
};

//
// 🔹 Registrar usuario en base de datos desde Firebase
//
export const createUserFromFirebase = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("❌ No se recibió Authorization header");
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // 🔹 Verificamos token de Firebase
    const idToken = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log("✅ Token verificado correctamente:", decoded.uid);

    const { uid, email, name } = decoded;
    const { phone } = req.body;

    console.log("🧩 Guardando usuario en base de datos:", email);

    const user = await User.upsertByFirebaseUid({
      firebase_uid: uid,
      name: req.body.name || name || "Sin nombre",
      email: email || req.body.email,
      phone: phone || null,
      role: "cliente",
    });

    console.log("✅ Usuario guardado en Postgres:", user);

    res.status(201).json({
      message: "✅ Usuario guardado correctamente en la base de datos.",
      user,
    });
  } catch (error) {
    console.error("🔥 Error guardando usuario desde Firebase:", error);
    res.status(500).json({ error: "Error al guardar usuario en el servidor." });
  }
};
