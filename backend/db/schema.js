const {
  mysqlTable,
  int,
  varchar,
  text,
  datetime,
  mysqlEnum,
} = require("drizzle-orm/mysql-core");

// Model user - gunakan nama tabel yang sama dengan database
const users = mysqlTable("user", {
  // ← nama tabel 'user' (bukan 'users')
  id: int("id").primaryKey().autoincrement(),
  nama: varchar("nama", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["Admin", "Penulis"]).default("Penulis"),
});

// Model kategori
const kategoris = mysqlTable("kategori", {
  // ← nama tabel 'kategori'
  id: int("id").primaryKey().autoincrement(),
  nama: varchar("nama", { length: 255 }).notNull(),
});

// Model quote
const quotes = mysqlTable("quote", {
  // ← nama tabel 'quote'
  id: int("id").primaryKey().autoincrement(),
  kategoriId: int("kategori_id").notNull(),
  quote: text("quote").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  userId: int("user_id").notNull(),
});

// Model refreshToken
const refreshTokens = mysqlTable("refresh_token", {
  // ← nama tabel 'refresh_token'
  id: int("id").primaryKey().autoincrement(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  userId: int("user_id").notNull(),
  createdAt: datetime("created_at").default(new Date()),
});

module.exports = {
  users,
  kategoris,
  quotes,
  refreshTokens
};