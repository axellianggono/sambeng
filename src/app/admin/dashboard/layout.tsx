'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/lib/dummy-data';
import { onAdminAuthStateChanged } from '@/lib/auth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { ShieldAlert, Loader } from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Gunakan Firebase Auth observer untuk memantau status login
    const unsubscribe = onAdminAuthStateChanged((user) => {
      if (!user) {
        // Tidak ada sesi Firebase Auth yang aktif → redirect ke login
        localStorage.removeItem('sambeng_admin_user');
        router.push('/admin/login');
      } else {
        setCurrentUser(user);
        // Sinkronisasi cache localStorage
        localStorage.setItem('sambeng_admin_user', JSON.stringify(user));
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center text-zinc-800">
        <div className="flex flex-col items-center gap-3">
          <Loader className="h-8 w-8 text-emerald-600 animate-spin" />
          <span className="text-zinc-500 text-sm font-semibold">Memeriksa sesi Firebase Auth...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Permission Check Function
  const hasAccess = () => {
    if (currentUser.role === 'SUPER_ADMIN') return true;
    
    if (pathname === '/admin/dashboard') return true;
    if (pathname.startsWith('/admin/dashboard/users')) return false; // Only superadmin
    if (pathname.startsWith('/admin/dashboard/profil') && !currentUser.permissions.includes('MANAGE_PROFIL')) return false;
    if (pathname.startsWith('/admin/dashboard/organisasi') && !currentUser.permissions.includes('MANAGE_ORGANISASI')) return false;
    if (pathname.startsWith('/admin/dashboard/umkm') && !currentUser.permissions.includes('MANAGE_UMKM')) return false;
    if (pathname.startsWith('/admin/dashboard/berita') && !currentUser.permissions.includes('MANAGE_BERITA')) return false;
    if (pathname.startsWith('/admin/dashboard/kontak') && !currentUser.permissions.includes('MANAGE_KONTAK')) return false;
    
    return true;
  };

  const allowed = hasAccess();

  return (
    <div className="bg-zinc-50 text-zinc-800 h-screen overflow-hidden flex">
      {/* Sidebar */}
      <AdminSidebar currentUser={currentUser} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-zinc-50">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-200 px-8 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium text-xs">CMS Panel</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-700 font-semibold text-xs capitalize">
              {pathname.split('/').pop() || 'Overview'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-500 font-medium">Firebase Auth Aktif</span>
          </div>
        </header>

        {/* Dynamic Page Render / Permission Alert */}
        <main className="flex-1 p-8 sm:p-10">
          {allowed ? (
            children
          ) : (
            /* Access Denied Alert */
            <div className="max-w-md mx-auto py-20 text-center bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm mt-8">
              <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Akses Ditolak</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Maaf, akun Anda tidak memiliki hak akses untuk mengelola data halaman ini. Hak akses dapat diatur oleh Super Admin (Dukuh).
              </p>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-left text-xs space-y-2">
                <p className="font-bold text-zinc-650">Hak Akses Anda Saat Ini:</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.permissions.length > 0 ? (
                    currentUser.permissions.map((p) => (
                      <span key={p} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 font-semibold text-[10px]">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-400">Tidak ada izin aktif</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
