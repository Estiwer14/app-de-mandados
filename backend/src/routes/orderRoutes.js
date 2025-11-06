import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getPendingOrders,
  acceptOrder,
  startOrder,
  deliverOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", authenticate, createOrder);
router.get("/pending", authenticate, getPendingOrders);
router.put("/:id/accept", authenticate, acceptOrder);
router.put("/:id/start", authenticate, startOrder);
router.put("/:id/deliver", authenticate, deliverOrder);

export default router;
