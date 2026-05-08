// routes/session.routes.js
import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
    current,
    getAllActive,
    getHistory,
    extend,
    terminate
} from "../controllers/session.controller.js";

const router = Router();

// Rutas para estudiantes (su propia sesión)
router.get("/current", auth, current);
router.post("/extend", auth, extend);
router.post("/terminate", auth, terminate);

// Rutas solo para admin
router.get("/all-active", auth, isAdmin, getAllActive);
router.get("/history", auth, isAdmin, getHistory);

export default router;