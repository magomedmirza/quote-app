import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllQuote = async (req, res) => {
  try {
    const quote = await prisma.quote.findMany({
      include: {
        user: { select: { nama: true } },
        kategori: { select: { nama: true } },
      },
    });
    if (quote.length === 0) {
      return res.status(404).json({ message: "Data Quote kosong !" });
    } else {
      return res.status(200).json(quote);
    }
  } catch (error) {
    return res.status(500).json({ error: error.code, message: error.message });
  }
};

export const getQuoteByUserId = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const quoteUserId = await prisma.quote.findMany({
      include: {
        user: { select: { nama: true } },
        kategori: { select: { nama: true } },
      },
      where: { userId: userId },
    });

    if (quoteUserId.length === 0) {
      return res.status(404).json({ message: "Anda Belum Memiliki Quote !" });
    } else {
      return res.status(200).json(quoteUserId);
    }
  } catch (error) {
    console.error("Error in getQuoteByUserId:", error);
    return res.status(500).json({ error: error.code, message: error.message });
  }
};

export const getQuoteById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const quote = await prisma.quote.findUnique({
      where: { id: id },
      include: {
        user: { select: { nama: true } },
        kategori: { select: { nama: true } },
      },
    });
    if (quote.length === 0) {
      return res.status(404).json({ message: "Data Quote kosong !" });
    } else {
      return res.status(200).json(quote);
    }
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};
export const createQuote = async (req, res) => {
  try {
    const { kategoriId, quote, author, userId } = req.body;
    const quotes = await prisma.quote.create({
      data: {
        kategoriId: Number(kategoriId),
        quote,
        author,
        userId: Number(userId),
      },
    });
    return res.status(201).json({ message: "Quote berhasil ditambah", quote });
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};
export const updateQuote = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { kategoriId, quote, author, userId } = req.body;

    const existingQuote = await prisma.quote.findUnique({
      where: { id: id },
    });

    if (!existingQuote) {
      return res.status(404).json({ message: "Quote tidak ditemukan." });
    }

    const updatedQuote = await prisma.quote.update({
      where: { id: id },
      data: {
        kategoriId: Number(kategoriId),
        quote,
        author,
        userId: Number(userId),
      },
    });

    return res
      .status(201)
      .json({ message: "Quote berhasil diupdate", quote: updatedQuote });
  } catch (error) {
    console.error("Error updating quote:", error);

    return res.status(500).json({
      message: "Gagal mengupdate quote karena kesalahan server.",
    });
  }
};
export const deleteQuote = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "ID quote tidak valid." });
  }

  try {
    await prisma.quote.delete({
      where: { id: id },
    });

    return res.status(200).json({ message: "Quote berhasil dihapus." });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Quote dengan ID tersebut tidak ditemukan." });
    }

    console.error("Error saat menghapus quote:", error);
    return res
      .status(500)
      .json({ message: "Gagal menghapus quote karena kesalahan server." });
  }
};
