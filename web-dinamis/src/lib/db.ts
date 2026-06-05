import mysql from "mysql2/promise";

// ============================================================
// Database Connection Pool
// Menggunakan connection pool untuk efisiensi koneksi
// ============================================================

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "lapor_user",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME || "lapor_id",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

export default pool;

// Helper: query dengan typed return
export async function query<T = unknown>(
  sql: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

// Helper: query single row
export async function queryOne<T = unknown>(
  sql: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}
