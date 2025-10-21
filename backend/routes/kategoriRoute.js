//MADE BY Andrian
import express from "express";
import {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
} from "../controllers/kategoriController.js";

const router = express.Router();

router.get("/", getAllKategori);
router.get("/:id", getKategoriById);
router.post("/", createKategori);
router.put("/:id", updateKategori);
router.delete("/:id", deleteKategori);
export default router;
