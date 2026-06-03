import { KategoriPengaduan, KATEGORI_LABELS, KATEGORI_COLORS } from "@/types";

interface KategoriBadgeProps {
  kategori: KategoriPengaduan;
}

export default function KategoriBadge({ kategori }: KategoriBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${KATEGORI_COLORS[kategori]}`}
    >
      {KATEGORI_LABELS[kategori]}
    </span>
  );
}
