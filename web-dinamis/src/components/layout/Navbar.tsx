"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield, FileText } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      {/* Top government strip */}
      <div className="bg-primary-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield size={12} />
            Website Resmi Pemerintah Daerah
          </span>
          <span className="hidden sm:block">
            Layanan Pengaduan Masyarakat Digital
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary-800 transition-colors">
              <FileText size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg text-primary-800 tracking-tight">
                LAPOR.ID
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                Pengaduan Masyarakat
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              Beranda
            </Link>
            <Link href="/cek-status" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              Cek Status
            </Link>
            <Link href="/tentang" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              Tentang
            </Link>
            <Link href="/pengaduan-baru" className="ml-2 btn-primary text-sm py-2 px-4">
              Buat Pengaduan
            </Link>
            <Link href="/login" className="ml-1 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 rounded-lg transition-colors border border-primary-200">
              Login Admin
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-fade-in">
          <Link href="/" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Beranda</Link>
          <Link href="/cek-status" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Cek Status</Link>
          <Link href="/tentang" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Tentang</Link>
          <Link href="/pengaduan-baru" className="block px-4 py-2.5 text-sm font-semibold text-white bg-primary-700 rounded-lg text-center" onClick={() => setIsOpen(false)}>Buat Pengaduan</Link>
          <Link href="/login" className="block px-4 py-2.5 text-sm font-semibold text-primary-700 border border-primary-200 rounded-lg text-center" onClick={() => setIsOpen(false)}>Login Admin</Link>
        </div>
      )}
    </nav>
  );
}
