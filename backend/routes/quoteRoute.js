import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

import {
  getAllQuote,
  getQuoteByUserId,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
} from "../controllers/quoteController.js";

router.get("/", getAllQuote);
router.get("/user/:id", authMiddleware, getQuoteByUserId);
router.get("/:id", authMiddleware, getQuoteById);
router.post("/", authMiddleware, createQuote);
router.put("/:id", authMiddleware, updateQuote);
router.delete("/:id", authMiddleware, deleteQuote);

export default router;
