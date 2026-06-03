import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildUrl: (page: number) => string;
  totalItems: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  buildUrl,
  totalItems,
  pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  // Kalkulasi halaman yang ditampilkan (max 5 angka)
  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-gray-500">
        Menampilkan{" "}
        <span className="font-semibold text-gray-700">
          {start}–{end}
        </span>{" "}
        dari{" "}
        <span className="font-semibold text-gray-700">{totalItems}</span> data
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <span className="p-2 rounded-lg text-gray-300 cursor-not-allowed">
            <ChevronLeft size={16} />
          </span>
        )}

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
            >
              ···
            </span>
          ) : (
            <Link
              key={page}
              href={buildUrl(page as number)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-primary-700 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          )
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="p-2 rounded-lg text-gray-300 cursor-not-allowed">
            <ChevronRight size={16} />
          </span>
        )}
      </div>
    </div>
  );
}
