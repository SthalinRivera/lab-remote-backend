// routes/lab.routes.js
import { Router } from "express";
import { LabController } from "../controllers/lab.controller.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

// Rutas públicas (solo consulta de estado)
router.get("/status", LabController.getStatus);

// Rutas protegidas (requieren admin)
router.get("/config", LabController.getConfig);
router.put("/config/:id", LabController.updateConfig);
router.patch("/config/:id", LabController.updateConfig);
router.patch("/:id/busy-status", LabController.updateBusyStatus);

export default router;