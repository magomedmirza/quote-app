// src/auth/tokenService.js

import { SignJWT, jwtVerify } from "jose";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/key.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Pastikan model RefreshToken sudah ada di schema.prisma Anda!

/**
 * Membuat Access Token dan Refresh Token, lalu menyimpan Refresh Token di database.
 * @param {object} userPayload - Payload minimal untuk dimasukkan ke dalam JWT (misal: {id, username}).
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
export async function generateTokens(userPayload) {
  // 1. Access Token (Short-lived, untuk otorisasi API)
  const accessToken = await new SignJWT(userPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // Access Token kedaluwarsa dalam 15 menit
    .sign(ACCESS_TOKEN_SECRET);

  // 2. Refresh Token (Long-lived, untuk mendapatkan token baru)
  // Payload Refresh Token disarankan lebih minimal, cukup userId.
  const refreshToken = await new SignJWT({ userId: userPayload.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // Refresh Token kedaluwarsa dalam 30 hari
    .sign(REFRESH_TOKEN_SECRET);

  // 3. Simpan Refresh Token ke Database (Prisma)
  // Ini penting untuk keamanan (Revocation & Rotation)
  try {
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userPayload.id,
      },
    });
  } catch (error) {
    console.error("Gagal menyimpan Refresh Token ke database:", error);
    // Tergantung kebijakan Anda, Anda mungkin ingin melemparkan error di sini
    // return new Error("Gagal menyimpan Refresh Token");
  }

  return { accessToken, refreshToken };
}

// ---

/**
 * Memverifikasi Access Token (digunakan di middleware otorisasi).
 * @param {string} token - Access Token (JWT string)
 * @returns {Promise<object>} - Payload token yang sudah terverifikasi.
 */
export async function verifyAccessToken(token) {
  // jwtVerify akan melemparkan error jika token tidak valid (misal: expired, signature salah)
  const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
  return payload;
}

// ---

/**
 * Memverifikasi Refresh Token (digunakan di endpoint /refresh).
 * @param {string} token - Refresh Token (JWT string)
 * @returns {Promise<object>} - Payload token yang sudah terverifikasi.
 */
export async function verifyRefreshToken(token) {
  // jwtVerify akan melemparkan error jika token tidak valid atau expired
  const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
  return payload;
}
