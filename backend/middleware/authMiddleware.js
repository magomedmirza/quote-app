// middleware/authMiddleware.js

import { jwtVerify } from "jose";
import { ACCESS_TOKEN_SECRET } from "../config/key.js"; // Pastikan path ke key.js benar

async function authMiddleware(req, res, next) {
  // 1. Ambil Header Otorisasi
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Access Token tidak ditemukan." });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    // 2. Verifikasi Access Token dengan jose
    const { payload } = await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);

    // 3. Jika berhasil, simpan payload user ke request object
    req.user = payload;

    // Lanjutkan ke controller
    next();
  } catch (error) {
    // Token tidak valid atau kedaluwarsa
    console.error("Access Token Verification Failed:", error.message);
    return res
      .status(403)
      .json({
        message:
          "Access Token tidak valid atau kedaluwarsa. Silakan refresh token atau login ulang.",
      });
  }
}

export default authMiddleware;
