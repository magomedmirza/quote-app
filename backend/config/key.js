// config/key.js

const { createSecretKey } = require("crypto");
const dotenv = require("dotenv");
// Menggunakan 'dotenv/config' di file utama (index.js) atau app.js lebih disarankan,
// tapi ini berfungsi jika Anda mengimpor file ini terlebih dahulu.
dotenv.config();

// Ambil nilai string dari .env
// Pastikan nama variabel di .env Anda adalah ACCESS_TOKEN dan REFRESH_TOKEN
const ACCESS_TOKEN_SECRET_STRING =
  process.env.ACCESS_TOKEN ?? "secret_string_default_access_token";
const REFRESH_TOKEN_SECRET_STRING =
  process.env.REFRESH_TOKEN ?? "another_secret_string_default_refresh_token";

// SOLUSI: Konversi string menjadi format Uint8Array yang diperlukan jose
// createSecretKey(string, encoding) akan melakukan konversi ini.
const ACCESS_TOKEN_SECRET = createSecretKey(
  ACCESS_TOKEN_SECRET_STRING,
  "utf-8"
);
const REFRESH_TOKEN_SECRET = createSecretKey(
  REFRESH_TOKEN_SECRET_STRING,
  "utf-8"
);

// Ekspor variabel yang sudah dalam format Uint8Array
module.exports = { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };