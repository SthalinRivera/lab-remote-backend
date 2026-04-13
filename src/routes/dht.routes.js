import express from "express";
import { getDHT, setDHT } from "../controllers/dht.controller.js";

const router = express.Router();

// 📥 Obtener datos
router.get("/", getDHT);

// 📤 Enviar datos desde ESP32
router.post("/", setDHT);

export default router;