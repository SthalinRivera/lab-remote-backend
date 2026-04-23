// controllers/queue.controller.js
import { joinQueue, getQueueStatus } from "../services/queue.service.js";

export const join = async (req, res) => {
  try {
    const data = await joinQueue(req.user.id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error queue" });
  }
};

export const status = async (req, res) => {
  try {
    const data = await getQueueStatus(req.user.id);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error status" });
  }
};