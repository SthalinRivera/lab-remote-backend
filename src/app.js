import express from "express";
import cors from "cors";
import deviceRoutes from "./routes/device.routes.js";
import otaRoutes from "./routes/ota.routes.js"; // 🔥 NUEVO
import messageRoutes from "./routes/message.routes.js";
import dhtRoutes from "./routes/dht.routes.js";
import authRoutes from "./routes/auth.routes.js";
import queueRoutes from "./routes/queue.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import usersRoutes from "./routes/users.routes.js"
import metricsRoutes from "./routes/metrics.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import labRoutes from './routes/lab.routes.js';
import aiMetricsRoutes from "./routes/aiMetrics.routes.js";
import systemMetricsRoutes from "./routes/systemMetrics.routes.js";
import videoMetricsRoutes from "./routes/videoMetrics.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (_, res) => {
    res.status(200).json({
        ok: true,
        message: "🚀 Lab Remote API funcionando correctamente"
    });
});

app.get("/health", (_, res) => {
    res.status(200).json({
        status: "ok"
    });
});
app.use("/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dht", dhtRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/ota", otaRoutes); // 🔥 IMPORTANTE
app.use("/api/message", messageRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/ai-metrics", aiMetricsRoutes);
app.use("/api/metrics", metricsRoutes); // ✅ agregado
app.use("/api/system-metrics", systemMetricsRoutes);
app.use("/api/video-metrics", videoMetricsRoutes);
app.use('/api/lab', labRoutes);
export default app;