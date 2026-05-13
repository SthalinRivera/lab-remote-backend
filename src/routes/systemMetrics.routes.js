import express from "express";

import { auth } from "../middlewares/auth.middleware.js";

import {

    getMetrics,
    getStats,
    createMetric

} from "../controllers/systemMetrics.controller.js";

const router = express.Router();

// 🔹 ALL
router.get("/", auth, getMetrics);

// 🔹 STATS
router.get("/stats", auth, getStats);

// 🔹 CREATE
router.post("/", createMetric);

export default router;