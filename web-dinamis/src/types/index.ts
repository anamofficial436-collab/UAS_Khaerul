// ============================================================
// Types & Interfaces - Sistem Pengaduan Masyarakat
// ============================================================

export type StatusPengaduan = "menunggu" | "diproses" | "selesai";
export type KategoriPengaduan =
  | "infrastruktur"
  | "lingkungan"
  | "keamanan"
  | "pelayanan_publik"
  | "sosial"
  | "lainnya";
export type RoleUser = "admin";

export interface User {
  id: number;
  username: string;
  role: RoleUser;
  created_at: string;
}

export interface Pengaduan {
  id: number;
  nama: string;
  email: string;
  judul: string;
  kategori: KategoriPengaduan;
  isi: string;
  foto: string | null;
  status: StatusPengaduan;
  created_at: string;
  updated_at: string;
}

export interface PengaduanFormData {
  nama: string;
  email: string;
  judul: string;
  kategori: KategoriPengaduan;
  isi: string;
}

export interface DashboardStats {
  total: number;
  menunggu: number;
  diproses: number;
  selesai: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SessionData {
  userId: number;
  username: string;
  role: RoleUser;
  isLoggedIn: boolean;
}

export const KATEGORI_LABELS: Record<KategoriPengaduan, string> = {
  infrastruktur: "Infrastruktur",
  lingkungan: "Lingkungan",
  keamanan: "Keamanan",
  pelayanan_publik: "Pelayanan Publik",
  sosial: "Sosial",
  lainnya: "Lainnya",
};

export const STATUS_LABELS: Record<StatusPengaduan, string> = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
};

export const STATUS_COLORS: Record<StatusPengaduan, string> = {
  menunggu: "bg-yellow-100 text-yellow-800 border-yellow-200",
  diproses: "bg-blue-100 text-blue-800 border-blue-200",
  selesai: "bg-green-100 text-green-800 border-green-200",
};

export const KATEGORI_COLORS: Record<KategoriPengaduan, string> = {
  infrastruktur: "bg-orange-100 text-orange-700",
  lingkungan: "bg-green-100 text-green-700",
  keamanan: "bg-red-100 text-red-700",
  pelayanan_publik: "bg-purple-100 text-purple-700",
  sosial: "bg-pink-100 text-pink-700",
  lainnya: "bg-gray-100 text-gray-700",
};
