'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/lib/dummy-data';
import { logoutAdmin } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  Landmark,
  Network,
  ShoppingBag,
  Newspaper,
  LogOut,
  Mail,
} from 'lucide-react';

interface SidebarProps {
  currentUser: User | null;
}

export default function AdminSidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      localStorage.removeItem('sambeng_admin_user');
      router.push('/admin/login');
    } catch (err) {
      console.error('Gagal logout:', err);
    }
  };

  const hasPermission = (permission: string) => {
    if (!currentUser) return false;
    if (currentUser.role === 'SUPER_ADMIN') return true;
    return currentUser.permissions.includes(permission as any);
  };

  const navItems = [
    {
      name: 'Ringkasan',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Kelola Pengguna',
      href: '/admin/dashboard/users',
      icon: Users,
      show: currentUser?.role === 'SUPER_ADMIN',
    },
    {
      name: 'Profil Desa',
      href: '/admin/dashboard/profil',
      icon: Landmark,
      show: hasPermission('MANAGE_PROFIL'),
    },
    {
      name: 'Organisasi',
      href: '/admin/dashboard/organisasi',
      icon: Network,
      show: hasPermission('MANAGE_ORGANISASI'),
    },
    {
      name: 'UMKM & Produk',
      href: '/admin/dashboard/umkm',
      icon: ShoppingBag,
      show: hasPermission('MANAGE_UMKM'),
    },
    {
      name: 'Berita',
      href: '/admin/dashboard/berita',
      icon: Newspaper,
      show: hasPermission('MANAGE_BERITA'),
    },
    {
      name: 'Hubungi Kami',
      href: '/admin/dashboard/kontak',
      icon: Mail,
      show: hasPermission('MANAGE_KONTAK'),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 text-zinc-650 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-zinc-200 flex items-center gap-2 text-zinc-800 font-bold">
          <Landmark className="h-6 w-6 text-emerald-600" />
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-wide text-zinc-900">CMS Sambeng</span>
            <span className="text-[10px] text-zinc-400 font-semibold">Padukuhan Panel</span>
          </div>
        </div>

        {/* User Info Card */}
        {currentUser && (
          <div className="p-4 mx-4 my-6 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Staff Admin'}
            </p>
            <h4 className="text-sm font-bold text-zinc-800 mt-0.5 truncate">{currentUser.name}</h4>
            <p className="text-[10px] text-zinc-500 truncate mt-0.5">{currentUser.email}</p>
          </div>
        )}

        {/* Nav list */}
        <nav className="px-4 space-y-1.5">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'hover:bg-zinc-100 hover:text-zinc-900 border border-transparent'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-zinc-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl text-sm font-semibold transition-all text-left"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </aside>
  );
}
