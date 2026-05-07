// routes/metrics.routes.js
import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
    getMyMetrics,
    getAllMetrics,
    getMetricsById
} from "../controllers/metrics.controller.js";

const router = express.Router();

// ✅ Aplicar middleware EXPLÍCITAMENTE a cada ruta
router.get("/me", auth, getMyMetrics);  // ← Middleware aquí
router.get("/all", auth, getAllMetrics);
router.get("/:id", auth, getMetricsById);

export default router;