import { KategoriPengaduan, StatusPengaduan } from "@/types";

// ============================================================
// Utility Functions
// ============================================================

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const KATEGORI_OPTIONS: { value: KategoriPengaduan; label: string }[] = [
  { value: "infrastruktur", label: "Infrastruktur" },
  { value: "lingkungan", label: "Lingkungan" },
  { value: "keamanan", label: "Keamanan" },
  { value: "pelayanan_publik", label: "Pelayanan Publik" },
  { value: "sosial", label: "Sosial" },
  { value: "lainnya", label: "Lainnya" },
];

export const STATUS_OPTIONS: { value: StatusPengaduan; label: string }[] = [
  { value: "menunggu", label: "Menunggu" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
];

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
