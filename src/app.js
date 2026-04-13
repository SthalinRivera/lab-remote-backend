import express from "express";
import cors from "cors";
import deviceRoutes from "./routes/device.routes.js";
import otaRoutes from "./routes/ota.routes.js"; // 🔥 NUEVO
import messageRoutes from "./routes/message.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/device", deviceRoutes);
app.use("/api/ota", otaRoutes); // 🔥 IMPORTANTE
app.use("/api/message", messageRoutes);
export default app;