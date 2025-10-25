//MADE BY Andrian
const express = require("express");
const {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
} = require("../controllers/kategoriController");

const router = express.Router();

router.get("/", getAllKategori);
router.get("/:id", getKategoriById);
router.post("/", createKategori);
router.put("/:id", updateKategori);
router.delete("/:id", deleteKategori);

module.exports = router;