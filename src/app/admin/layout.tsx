"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Users,
  ShoppingBag,
  Newspaper,
  Calendar,
  LogOut,
  Leaf,
  Loader2
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  // Bypass layout formatting on the login page itself
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If redirect is in progress, prevent rendering admin components
  if (!user) {
    return null;
  }

  const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Kelola Beranda", href: "/admin/beranda", icon: HomeIcon },
    { name: "Kelola Organisasi", href: "/admin/organisasi", icon: Users },
    { name: "Kelola UMKM", href: "/admin/umkm", icon: ShoppingBag },
    { name: "Kelola Berita", href: "/admin/berita", icon: Newspaper },
    { name: "Kelola Acara", href: "/admin/acara", icon: Calendar },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-primary-900 text-gray-200 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Brand */}
          <div className="p-6 border-b border-primary-800 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary-400" />
              <span className="font-extrabold text-lg text-white tracking-tight">
                Admin Sambeng
              </span>
            </Link>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-800 text-white font-semibold shadow-inner"
                      : "text-primary-100 hover:bg-primary-800/50 hover:text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-primary-800">
          <div className="px-4 py-2 text-xs text-primary-300 truncate font-semibold mb-2">
            Login: {user.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/35 hover:text-rose-100 transition-all text-left"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard Wrapper */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
