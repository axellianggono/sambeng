"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin dashboard pages to prevent layout clutter
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-primary-900 text-gray-200 border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-primary-400" />
              <span className="font-bold text-xl text-white tracking-tight">
                Padukuhan Sambeng
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Situs informasi resmi digital untuk Padukuhan Sambeng. Menyediakan profil, berita terbaru, katalog UMKM, agenda acara, dan informasi organisasi padukuhan.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-md mb-4">Peta Situs</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition">Beranda</Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-white transition">Profil Padukuhan</Link>
              </li>
              <li>
                <Link href="/organisasi" className="hover:text-white transition">Organisasi & Lembaga</Link>
              </li>
              <li>
                <Link href="/umkm" className="hover:text-white transition">Katalog UMKM</Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-white transition">Berita Kegiatan</Link>
              </li>
              <li>
                <Link href="/acara" className="hover:text-white transition">Agenda Acara</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-md mb-4">Kontak & Lokasi</h3>
            <p className="text-sm text-gray-400 mb-2">
              Padukuhan Sambeng, Kalurahan Sambeng, Kapanewon Gunungkidul, Kabupaten Gunungkidul, D.I. Yogyakarta, Indonesia.
            </p>
            <p className="text-sm text-gray-400">
              Email: info@sambeng.desa.id<br />
              WhatsApp: +62 812-3456-7890
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-800 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Pemerintah Padukuhan Sambeng. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
