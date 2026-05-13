// routes/videoMetrics.routes.js

import express from "express";

import {
    getVideoMetrics,
    getVideoStats,
    createVideoMetric
} from "../controllers/videoMetrics.controller.js";

const router = express.Router();

// 🔹 TODAS LAS MÉTRICAS
router.get("/", getVideoMetrics);

// 🔹 ESTADÍSTICAS
router.get("/stats", getVideoStats);

// 🔹 INSERTAR MÉTRICA
router.post("/", createVideoMetric);

export default router;