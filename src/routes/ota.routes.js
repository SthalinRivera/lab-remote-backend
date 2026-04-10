import { Router } from "express";
import multer from "multer";
import {
  subirFirmware,
  getFirmwareURL
} from "../controllers/ota.controller.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("firmware"), subirFirmware);

// 🔥 importante
router.get("/url", getFirmwareURL);

export default router;