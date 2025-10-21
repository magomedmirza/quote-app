//MADE BY Andrian
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllKategori = async (req, res) => {
  try {
    const kategori = await prisma.kategori.findMany();
    if (kategori.length === 0) {
      return res
        .status(404)
        .json({ message: "Data kategori masih kosong bro" });
    } else {
      return res.status(200).json(kategori);
    }
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};
export const getKategoriById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const kategori = await prisma.kategori.findUnique({
      where: { id: id },
    });
    if (!kategori) {
      return res.status(404).json({ message: "Data kategori tidak ditemukan" });
    } else {
      return res.status(200).json(kategori);
    }
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};

export const createKategori = async (req, res) => {
  try {
    const { nama } = req.body;
    const kategori = await prisma.kategori.create({
      data: { nama },
    });
    return res
      .status(201)
      .json({ message: "Data kategori berhasil ditambah", kategori });
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};

export const updateKategori = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama } = req.body;
    const user = await prisma.kategori.update({
      where: { id: id },
      data: { nama },
    });
    return res
      .status(201)
      .json({ message: "Data kategori berhasil diupdate", user });
  } catch (error) {
    return res.status(500).json({ error: error.code, message: error.message });
  }
};

export const deleteKategori = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.kategori.delete({
      where: { id: id },
    });
    return res.status(201).json({ message: "Data kategori berhasil dihapus" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "id kategori tidak ditemukan !" });
    }
    return res.status(500).json({ error: error.code, message: error.message });
  }
};
