const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");

let db = null;
let connection = null;

async function initializeDB() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "root",
      database: process.env.DB_NAME || "db_quote",
      // Sederhanakan dulu
      charset: "utf8",
      timezone: "+07:00",
    });

    console.log("✅ Database connected successfully");

    // Coba tanpa schema dulu
    db = drizzle(connection, {
      mode: "default",
      logger: true,
    });

    // Test koneksi dengan query sederhana
    const testResult = await connection.execute("SELECT 1 as test");
    console.log("✅ Database test query successful:", testResult[0]);

    return db;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call initializeDB() first.");
  }
  return db;
}

module.exports = {
  initializeDB,
  getDB,
};