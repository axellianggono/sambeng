'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { getVillageProfile } from '@/lib/db';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isTop, setIsTop] = useState(true);
  const pathname = usePathname();
  const hasFetched = useRef(false);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Profil', href: '/profil' },
    { name: 'Organisasi', href: '/organisasi' },
    { name: 'UMKM', href: '/umkm' },
    { name: 'Berita', href: '/berita' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('sambeng_village_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.logoUrl) {
          setLogoUrl(parsed.logoUrl);
        } else {
          setLogoUrl('');
        }
      } catch (e) {
        setLogoUrl('');
      }
    }

    if (!hasFetched.current) {
      const fetchProfile = async () => {
        try {
          const profile = await getVillageProfile();
          if (profile) {
            setLogoUrl(profile.logoUrl || '');
            localStorage.setItem('sambeng_village_profile', JSON.stringify(profile));
            hasFetched.current = true;
          }
        } catch (e) {
          console.error('Gagal memuat profil desa di Navbar:', e);
        }
      };
      fetchProfile();
    }
  }, [pathname]);

  const isHomeHero = pathname === '/' && isTop;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomeHero
          ? 'bg-transparent border-transparent py-2'
          : 'bg-white/90 backdrop-blur-md border-b border-zinc-200/80 shadow-sm py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 font-bold text-lg tracking-wide transition-colors ${
                isHomeHero ? 'text-white' : 'text-emerald-700'
              }`}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Sambeng" className="h-8 w-auto object-contain max-w-[120px]" />
              ) : null}
              <span>Sambeng</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all hover:text-emerald-500 ${
                  isHomeHero
                    ? isActive(link.href)
                      ? 'text-white font-bold border-b-2 border-white pb-1'
                      : 'text-zinc-200 hover:text-white'
                    : isActive(link.href)
                      ? 'text-emerald-600 font-bold border-b-2 border-emerald-600 pb-1'
                      : 'text-zinc-600 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className={`flex items-center gap-1.5 px-4 h-9 rounded-full text-sm font-semibold transition-all shadow-sm ${
                isHomeHero
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/15'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                isHomeHero
                  ? 'text-zinc-200 hover:text-white hover:bg-white/10'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
              }`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden transition-all duration-200 ${
            isHomeHero
              ? 'bg-zinc-950/95 text-white border-b border-zinc-900'
              : 'bg-white border-b border-zinc-200 shadow-lg'
          }`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isHomeHero
                    ? isActive(link.href)
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    : isActive(link.href)
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-zinc-650 hover:bg-zinc-50 hover:text-emerald-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 mt-4 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isHomeHero
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
