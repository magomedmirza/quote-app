const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config/key");
const db = require("../db/index").getDB();
const { eq } = require("drizzle-orm");
const { refreshTokens } = require("../db/schema");

/**
 * Membuat Access Token dan Refresh Token, lalu menyimpan Refresh Token di database.
 */
async function generateTokens(userPayload) {
  // Dynamic import untuk jose
  const { SignJWT } = await import("jose");

  const accessTokenSecret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
  const refreshTokenSecret = new TextEncoder().encode(REFRESH_TOKEN_SECRET);

  // 1. Access Token
  const accessToken = await new SignJWT({
    userId: userPayload.id,
    nama: userPayload.nama,
    role: userPayload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessTokenSecret);

  // 2. Refresh Token
  const refreshToken = await new SignJWT({ userId: userPayload.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(refreshTokenSecret);

  // 3. Simpan Refresh Token ke Database
  try {
    await db.insert(refreshTokens).values({
      token: refreshToken,
      userId: userPayload.id,
    });
  } catch (error) {
    console.error("Gagal menyimpan Refresh Token ke database:", error);
  }

  return { accessToken, refreshToken };
}

/**
 * Memverifikasi Access Token
 */
async function verifyAccessToken(token) {
  try {
    const { jwtVerify } = await import("jose");
    const accessTokenSecret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, accessTokenSecret);

    console.log("✅ Access token verified:", {
      userId: payload.userId,
      nama: payload.nama,
      role: payload.role,
    });

    return payload;
  } catch (error) {
    console.error("Access Token verification failed:", error.message);
    throw new Error("Invalid or expired access token");
  }
}

/**
 * Memverifikasi Refresh Token
 */
async function verifyRefreshToken(token) {
  try {
    const { jwtVerify } = await import("jose");
    const refreshTokenSecret = new TextEncoder().encode(REFRESH_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, refreshTokenSecret);
    return payload;
  } catch (error) {
    console.error("Refresh Token verification failed:", error.message);
    throw new Error("Invalid or expired refresh token");
  }
}

// ... fungsi lainnya tetap sama
async function deleteRefreshToken(token) {
  try {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  } catch (error) {
    console.error("Gagal menghapus refresh token:", error);
    throw error;
  }
}

async function isRefreshTokenExists(token) {
  try {
    const [result] = await db
      .select({ token: refreshTokens.token })
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);

    return !!result;
  } catch (error) {
    console.error("Gagal memeriksa refresh token:", error);
    return false;
  }
}

async function deleteAllUserRefreshTokens(userId) {
  try {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  } catch (error) {
    console.error("Gagal menghapus refresh tokens user:", error);
    throw error;
  }
}

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  deleteRefreshToken,
  isRefreshTokenExists,
  deleteAllUserRefreshTokens,
};
