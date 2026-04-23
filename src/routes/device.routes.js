//routes/devide.routers.js
import { Router } from "express";
import {
    getEstado,
    encender,
    apagar
} from "../controllers/device.controller.js";

const router = Router();

router.get("/estado", getEstado);
router.post("/on", encender);
router.post("/off", apagar);

export default router;