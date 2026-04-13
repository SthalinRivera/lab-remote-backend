import express from "express";
import {
  getMensaje,
  setMensaje
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/", getMensaje);
router.post("/", setMensaje);

export default router;