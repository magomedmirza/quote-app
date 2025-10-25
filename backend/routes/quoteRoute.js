const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const {
  getAllQuote,
  getQuoteByUserId,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
} = require("../controllers/quoteController");

router.get("/", getAllQuote);
router.get("/user/:id", authMiddleware, getQuoteByUserId);
router.get("/:id", authMiddleware, getQuoteById);
router.post("/", authMiddleware, createQuote);
router.put("/:id", authMiddleware, updateQuote);
router.delete("/:id", authMiddleware, deleteQuote);

module.exports = router;
