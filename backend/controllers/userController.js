const db = require("../db/index").getDB();
const { users } = require("../db/schema");
const { hashPW } = require("../config/bcrypt");
const { eq, and, ne } = require("drizzle-orm");

const getAllUser = async (req, res) => {
  try {
    const userList = await db
      .select({
        id: users.id,
        nama: users.nama,
        username: users.username,
        role: users.role,
        // Jangan include password untuk security
      })
      .from(users);

    if (userList.length === 0) {
      return res.status(404).json({ message: "Data user kosong !" });
    }

    return res.status(200).json(userList);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID harus berupa angka" });
    }

    const [user] = await db
      .select({
        id: users.id,
        nama: users.nama,
        username: users.username,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: "Data user tidak ditemukan !" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { nama, username, password, role } = req.body;

    // Validation
    if (!nama || !username || !password) {
      return res
        .status(400)
        .json({ message: "Nama, username, dan password wajib diisi" });
    }

    // Check if username already exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser) {
      return res.status(409).json({ message: "Username sudah terdaftar" });
    }

    // Hash password dengan await
    const hashedPassword = await hashPW(password);

    const [newUser] = await db
      .insert(users)
      .values({
        nama,
        username,
        password: hashedPassword, // gunakan hashed password
        role: role || "Penulis",
      })
      .$returningId();

    // Get the created user data
    const [createdUser] = await db
      .select({
        id: users.id,
        nama: users.nama,
        username: users.username,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, newUser.insertId))
      .limit(1);

    return res.status(201).json({
      message: "Data user berhasil ditambah",
      user: createdUser,
    });
  } catch (error) {
    console.error("Create User Error:", error);

    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return res.status(409).json({ message: "Username sudah terdaftar" });
    }

    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama, username, password, role } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID harus berupa angka" });
    }

    // Cek apakah user exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Check username uniqueness (exclude current user)
    if (username) {
      const [userWithSameUsername] = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.username, username), ne(users.id, id)))
        .limit(1);

      if (userWithSameUsername) {
        return res
          .status(409)
          .json({ message: "Username sudah digunakan oleh user lain" });
      }
    }

    const updateData = { nama, username, role };

    // SOLUSI: Gunakan bcrypt langsung tanpa hashPW function
    if (password && password.trim() !== "") {
      const bcrypt = require("bcrypt");
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    // Get updated user data
    await db
      .select({
        id: users.id,
        nama: users.nama,
        username: users.username,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return res.status(200).json({
      message: "Data user berhasil diupdate",
    });
  } catch (error) {
    console.error("Update User Error:", error);

    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return res.status(409).json({ message: "Username sudah terdaftar" });
    }

    return res.status(500).json({
      message: "Terjadi kesalahan server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID harus berupa angka" });
    }

    // Cek apakah user exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await db.delete(users).where(eq(users.id, id));

    return res.status(200).json({
      message: "Data user berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    // Handle foreign key constraint error (jika user punya related data)
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
      return res.status(409).json({
        message: "Tidak dapat menghapus user karena memiliki data terkait",
      });
    }

    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
