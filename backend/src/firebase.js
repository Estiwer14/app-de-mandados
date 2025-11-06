import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

try {
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL
  ) {
    console.error("❌ Faltan variables de entorno de Firebase");
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log("✅ Firebase Admin inicializado correctamente");
  }
} catch (error) {
  console.error("❌ Error inicializando Firebase Admin:", error);
}

export default admin;
