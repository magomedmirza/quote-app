const db = require("../db/index").getDB();
const { quotes, users, kategoris } = require("../db/schema");
const { eq, and } = require("drizzle-orm");

const getAllQuote = async (req, res) => {
  try {
    const quote = await db
      .select({
        id: quotes.id,
        quote: quotes.quote,
        author: quotes.author,
        kategoriId: quotes.kategoriId,
        userId: quotes.userId,
        user: { nama: users.nama },
        kategori: { nama: kategoris.nama },
      })
      .from(quotes)
      .leftJoin(users, eq(quotes.userId, users.id))
      .leftJoin(kategoris, eq(quotes.kategoriId, kategoris.id));
    if (quote.length === 0) {
      return res.status(404).json({ message: "Data Quote kosong !" });
    }

    return res.status(200).json(quote);
  } catch (error) {
    console.error("Error in getAllQuote:", error);
    return res.status(500).json({
      error: error.code,
      message: error.message,
      stack: error.stack, // untuk melihat line error yang tepat
    });
  }
};

const getQuoteByUserId = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const quoteUserId = await db
      .select({
        id: quotes.id,
        quote: quotes.quote,
        author: quotes.author,
        kategoriId: quotes.kategoriId,
        userId: quotes.userId,
        user: { nama: users.nama },
        kategori: { nama: kategoris.nama },
      })
      .from(quotes)
      .leftJoin(users, eq(quotes.userId, users.id))
      .leftJoin(kategoris, eq(quotes.kategoriId, kategoris.id))
      .where(eq(quotes.userId, userId));

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

const getQuoteById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [quote] = await db
      .select({
        id: quotes.id,
        quote: quotes.quote,
        author: quotes.author,
        kategoriId: quotes.kategoriId,
        userId: quotes.userId,
        user: { nama: users.nama },
        kategori: { nama: kategoris.nama },
      })
      .from(quotes)
      .leftJoin(users, eq(quotes.userId, users.id))
      .leftJoin(kategoris, eq(quotes.kategoriId, kategoris.id))
      .where(eq(quotes.id, id))
      .limit(1);

    if (!quote) {
      return res.status(404).json({ message: "Data Quote tidak ditemukan !" });
    } else {
      return res.status(200).json(quote);
    }
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};

const createQuote = async (req, res) => {
  try {
    const { kategoriId, quote, author, userId } = req.body;

    await db.insert(quotes).values({
      kategoriId: Number(kategoriId),
      quote,
      author,
      userId: Number(userId),
    });

    return res.status(201).json({
      message: "Quote berhasil ditambah",
    });
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};

const updateQuote = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { kategoriId, quote, author, userId } = req.body;

    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, id))
      .limit(1);

    if (!existingQuote) {
      return res.status(404).json({ message: "Quote tidak ditemukan." });
    }

    await db
      .update(quotes)
      .set({
        kategoriId: Number(kategoriId),
        quote,
        author,
        userId: Number(userId),
      })
      .where(eq(quotes.id, id));

    return res.status(200).json({
      message: "Quote berhasil diupdate",
    });
  } catch (error) {
    console.error("Error updating quote:", error);
    return res.status(500).json({
      message: "Gagal mengupdate quote karena kesalahan server.",
    });
  }
};

const deleteQuote = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "ID quote tidak valid." });
  }

  try {
    await db.delete(quotes).where(eq(quotes.id, id));

    return res.status(200).json({ message: "Quote berhasil dihapus." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
      return res.status(404).json({
        message: "Quote dengan ID tersebut tidak ditemukan.",
      });
    }

    console.error("Error saat menghapus quote:", error);
    return res.status(500).json({
      message: "Gagal menghapus quote karena kesalahan server.",
    });
  }
};

module.exports = {
  getAllQuote,
  getQuoteByUserId,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
};
