import "dotenv/config";
import app from "./app.js";
import bucket from "./firebase.js";
import "./services/worker.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const [files] = await bucket.getFiles();
    console.log("🔥 Firebase conectado");
  } catch (error) {
    console.error("❌ Error Firebase:", error);
  }
})();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});