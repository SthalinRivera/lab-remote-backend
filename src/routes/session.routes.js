import { Router } from "express";
import { current } from "../controllers/session.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/current", auth, current);

export default router;