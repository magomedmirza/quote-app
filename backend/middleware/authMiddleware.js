const { ACCESS_TOKEN_SECRET } = require("../config/key");

async function authMiddleware(req, res, next) {
  // 1. Ambil Header Otorisasi
  const authHeader = req.headers.authorization;

  console.log("🛡️ Auth Middleware:", {
    path: req.path,
    method: req.method,
    hasAuthHeader: !!authHeader,
  });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No Bearer token found");
    return res
      .status(401)
      .json({ message: "Akses ditolak. Access Token tidak ditemukan." });
  }

  const accessToken = authHeader.split(" ")[1];

  console.log("🔐 Token received:", accessToken.substring(0, 20) + "...");

  try {
    // 2. Dynamic import untuk jose
    const { jwtVerify } = await import("jose");
    
    // Convert secret ke TextEncoder
    const accessTokenSecret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);

    const { payload } = await jwtVerify(accessToken, accessTokenSecret);

    console.log("✅ Token verified:", {
      userId: payload.userId,
      nama: payload.nama,
      role: payload.role,
    });

    // 3. Jika berhasil, simpan payload user ke request object
    req.user = payload;

    // Lanjutkan ke controller
    next();
  } catch (error) {
    // Token tidak valid atau kedaluwarsa
    console.error("❌ Access Token Verification Failed:", error.message);

    if (error.code === "ERR_JWT_EXPIRED") {
      return res.status(403).json({
        message: "Access Token expired. Silakan refresh token atau login ulang.",
      });
    } else {
      return res.status(403).json({
        message: "Access Token tidak valid. Silakan login ulang.",
      });
    }
  }
}

module.exports = authMiddleware;