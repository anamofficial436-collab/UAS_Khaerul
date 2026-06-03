"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/pengaduan", label: "Manajemen Pengaduan", icon: FileText },
];

function SidebarContent({
  onLogout,
  onNavClick,
}: {
  onLogout: () => void;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3 group" onClick={onNavClick}>
          <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-base text-primary-800">LAPOR.ID</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Admin Panel</span>
          </div>
        </Link>
      </div>

      <div className="px-4 py-3 mx-4 mt-4 bg-primary-50 rounded-lg border border-primary-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-700 rounded-full flex items-center justify-center">
            <Shield size={13} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-primary-800">Administrator</span>
            <span className="text-[10px] text-primary-500">Akses Penuh</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={isActive ? "sidebar-link-active" : "sidebar-link"}
            >
              <Icon size={17} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={17} />
          Keluar
        </button>
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r border-gray-100 flex-col shadow-sm">
        <SidebarContent onLogout={() => setLogoutOpen(true)} />
      </aside>
      <ConfirmDialog
        open={logoutOpen}
        title="Keluar dari Dashboard?"
        description="Sesi Anda akan diakhiri dan Anda akan diarahkan ke halaman login."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="warning"
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  );
}

export function MobileSidebarToggle() {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl flex flex-col lg:hidden animate-slide-up">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <X size={18} />
            </button>
            <SidebarContent
              onLogout={() => { setOpen(false); setLogoutOpen(true); }}
              onNavClick={() => setOpen(false)}
            />
          </div>
        </>
      )}

      <ConfirmDialog
        open={logoutOpen}
        title="Keluar dari Dashboard?"
        description="Sesi Anda akan diakhiri dan Anda akan diarahkan ke halaman login."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="warning"
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  );
}

export default DesktopSidebar;
