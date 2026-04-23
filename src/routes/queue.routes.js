import { Router } from "express";
import { join, status } from "../controllers/queue.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/join", auth, join);
router.get("/status", auth, status);

export default router;