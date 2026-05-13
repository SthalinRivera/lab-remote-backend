import express from "express";

import { auth } from "../middlewares/auth.middleware.js";

import {
    getMetrics,
    getStats,
    createMetric
} from "../controllers/aiMetrics.controller.js";

const router = express.Router();

// 🔹 TODAS LAS MÉTRICAS
router.get("/", getMetrics);

// 🔹 ESTADÍSTICAS IA
router.get("/stats", getStats);

// 🔹 INSERTAR MÉTRICA
router.post("/", createMetric);

export default router;