const db = require("../db/index").getDB();
const { kategoris } = require("../db/schema");
const { eq } = require("drizzle-orm");

const getAllKategori = async (req, res) => {
  try {
    const kategori = await db.select().from(kategoris);
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

const getKategoriById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [kategori] = await db
      .select()
      .from(kategoris)
      .where(eq(kategoris.id, id))
      .limit(1);

    if (!kategori) {
      return res.status(404).json({ message: "Data kategori tidak ditemukan" });
    } else {
      return res.status(200).json(kategori);
    }
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};

const createKategori = async (req, res) => {
  try {
    const { nama } = req.body;
    await db.insert(kategoris).values({ nama });

    return res.status(201).json({ message: "Data kategori berhasil ditambah" });
  } catch (error) {
    res.status(500).json({ error: error.code, message: error.message });
  }
};

const updateKategori = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama } = req.body;
    await db.update(kategoris).set({ nama }).where(eq(kategoris.id, id));

    return res.status(200).json({ message: "Data kategori berhasil diupdate" });
  } catch (error) {
    return res.status(500).json({ error: error.code, message: error.message });
  }
};

const deleteKategori = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(kategoris).where(eq(kategoris.id, id));

    return res.status(200).json({ message: "Data kategori berhasil dihapus" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
      return res.status(404).json({ message: "id kategori tidak ditemukan !" });
    }
    return res.status(500).json({ error: error.code, message: error.message });
  }
};

module.exports = {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
};
