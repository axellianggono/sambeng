"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Leaf, ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide main navbar on admin dashboard pages to prevent layout clutter
  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Organisasi", href: "/organisasi" },
    { name: "UMKM", href: "/umkm" },
    { name: "Berita", href: "/berita" },
    { name: "Acara", href: "/acara" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary-600 animate-pulse" />
              <span className="font-bold text-xl text-primary-800 tracking-tight">
                Sambeng
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    isActive ? "text-primary-600 border-b-2 border-primary-600 py-1" : "text-gray-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/admin"
              className="inline-flex items-center space-x-1 text-xs font-semibold bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100 transition"
            >
              <ShieldAlert className="h-3 w-3" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-primary-600 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-primary-50 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600"
          >
            Dashboard Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
