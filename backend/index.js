require("dotenv").config();
const crypto = require("crypto");
global.crypto = crypto;
const express = require("express");
const cors = require("cors");
const { initializeDB } = require("./db/index");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// KONFIGURASI CORS SEDERHANA DAN AMAN
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://localhost:5173",
    "https://api.zhaa.my.id",
    "http://api.zhaa.my.id",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
};

// GUNAKAN CORS MIDDLEWARE SAJA - TANPA app.options()
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database dan start server
async function startServer() {
  try {
    await initializeDB();
    console.log("✅ Database initialized successfully");

    // Import routes
    const authRoute = require("./routes/authRoute");
    const userRouter = require("./routes/userRoute");
    const kategoriRoute = require("./routes/kategoriRoute");
    const quoteRouter = require("./routes/quoteRoute");

    // Setup routes
    app.use("/api/auth", authRoute);
    app.use("/api/user", authMiddleware, userRouter);
    app.use("/api/kategori", authMiddleware, kategoriRoute);
    app.use("/api/quote", quoteRouter);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString(),
      });
    });

    // Test CORS endpoint
    app.get("/api/test-cors", (req, res) => {
      res.json({
        message: "CORS is working!",
        origin: req.headers.origin,
        timestamp: new Date().toISOString(),
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server started on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
