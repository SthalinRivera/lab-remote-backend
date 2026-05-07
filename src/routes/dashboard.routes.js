import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

// Todas las rutas requieren autenticación y rol de admin
// router.use(isAdmin);

// Rutas principales del dashboard
router.get("/stats", DashboardController.getStats);
router.get("/summary", DashboardController.getSystemSummary);

// Estadísticas específicas
router.get("/users/stats", DashboardController.getUserStats);
router.get("/sessions/stats", DashboardController.getSessionStats);
router.get("/queue/stats", DashboardController.getQueueStats);

// Estado del laboratorio
router.get("/lab", DashboardController.getLabStatus);

// Listados detallados
router.get("/sessions/active", DashboardController.getActiveSessions);
router.get("/queue/waiting", DashboardController.getQueueWithUsers);

// Métricas
router.get("/metrics/usage", DashboardController.getUsageMetrics);
router.get("/metrics/system", DashboardController.getSystemMetrics);

export default router;