import { PrismaClient } from "@prisma/client";
import { verifyPw } from "../config/bcrypt.js";
import { verifyRefreshToken } from "../service/tokenService.js";
import { generateTokens } from "../service/tokenService.js";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    // Menggunakan 401 Unauthorized untuk kegagalan otentikasi
    if (!user || !verifyPw(password, user.password)) {
      return res.status(401).json({ message: `Username atau password salah` });
    }

    // Jika user login ulang hapus refresh tokennya
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    // 1. Definisikan payload token
    const tokenPayload = {
      id: user.id,
      nama: user.nama,
      role: user.role,
    };

    // 2. Generate tokens
    const tokens = await generateTokens(tokenPayload);

    // 3. PERBAIKAN: Kirim data user lengkap termasuk role dan nama
    res.status(200).json({
      message: `Selamat Datang ${user.nama}`,
      userId: user.id,
      nama: user.nama, // ← TAMBAH INI
      role: user.role, // ← TAMBAH INI
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat login.",
      error: err.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.body;

  if (!oldRefreshToken) {
    return res.status(401).json({ message: "Refresh Token tidak tersedia." });
  }

  try {
    // 1. Verifikasi Token Kriptografi
    const payload = await verifyRefreshToken(oldRefreshToken);
    const userId = payload.userId;

    // 2. Cek Token di Database (Prisma)
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
    });

    if (!storedToken) {
      return res.status(401).json({
        message: "Refresh Token tidak valid atau dicabut. Silakan login ulang.",
      });
    }

    // 3. Refresh Token Rotation: Hapus token lama
    await prisma.refreshToken.delete({ where: { token: oldRefreshToken } });

    // 4. Generate Token Baru
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan." });
    }

    const newTokens = await generateTokens({
      id: user.id,
      nama: user.nama,
      role: user.role,
    });

    // 5. PERBAIKAN: Kirim data user lengkap
    res.json({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      nama: user.nama, // ← TAMBAH INI
      role: user.role, // ← TAMBAH INI
      userId: user.id, // ← TAMBAH INI (optional)
    });
  } catch (error) {
    console.error("Refresh Token Failed:", error.message);
    return res.status(403).json({
      message: "Refresh Token expired atau tidak valid. Silakan login ulang.",
    });
  }
};

export const logout = async (req, res) => {
  // Klien harus mengirimkan Refresh Token melalui body untuk dicabut
  const { refreshToken } = req.body;

  if (!refreshToken) {
    // Jika token tidak ada, anggap saja logout berhasil atau tidak ada sesi aktif
    return res.status(200).json({
      message: "Logout berhasil (tidak ada token yang perlu dicabut).",
    });
  }

  try {
    // Hapus (cabut) Refresh Token dari database (Prisma)
    const result = await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    if (result.count === 0) {
      // Token tidak ditemukan di DB, mungkin sudah dicabut sebelumnya
      return res
        .status(200)
        .json({ message: "Logout berhasil. Token sudah tidak aktif." });
    }

    return res
      .status(200)
      .json({ message: "Logout berhasil. Sesi telah diakhiri." });
  } catch (err) {
    console.error("Logout Error:", err);
    // Kesalahan server, misal masalah koneksi DB
    return res.status(500).json({ message: "Gagal memproses logout." });
  }
};
