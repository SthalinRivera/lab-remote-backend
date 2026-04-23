import "dotenv/config";
import app from "./app.js";
import bucket from "./firebase.js";
import "./services/worker.js";
const PORT = 4000;


(async () => {
  try {
    const [files] = await bucket.getFiles();
 
  } catch (error) {
    console.error("❌ Error Firebase:", error);
  }
})();
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});