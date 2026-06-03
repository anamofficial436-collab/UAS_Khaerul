import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DesktopSidebar, MobileSidebarToggle } from "@/components/dashboard/DashboardSidebar";
import { Bell } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.isLoggedIn) redirect("/login");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
          {/* Mobile hamburger */}
          <MobileSidebarToggle />

          {/* Title - visible on mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <span className="font-bold text-primary-800">LAPOR.ID</span>
            <span className="text-xs text-gray-400">Admin</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                A
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">Admin</div>
                <div className="text-xs text-gray-400">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
