import express from "express";
import cors from "cors";
import deviceRoutes from "./routes/device.routes.js";
import otaRoutes from "./routes/ota.routes.js"; // 🔥 NUEVO
import messageRoutes from "./routes/message.routes.js";
import dhtRoutes from "./routes/dht.routes.js";
import authRoutes from "./routes/auth.routes.js";
import queueRoutes from "./routes/queue.routes.js";
import sessionRoutes from "./routes/session.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.use("/api/dht", dhtRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/ota", otaRoutes); // 🔥 IMPORTANTE
app.use("/api/message", messageRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/session", sessionRoutes);
export default app;