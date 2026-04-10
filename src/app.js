import express from "express";
import cors from "cors";
import deviceRoutes from "./routes/device.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/device", deviceRoutes);

export default app;