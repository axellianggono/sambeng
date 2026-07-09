'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { getVillageProfile } from '@/lib/db';

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState<string>('');

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

    const fetchProfile = async () => {
      try {
        const profile = await getVillageProfile();
        if (profile) {
          setLogoUrl(profile.logoUrl || '');
          localStorage.setItem('sambeng_village_profile', JSON.stringify(profile));
        }
      } catch (e) {
        console.error('Gagal memuat profil desa di Footer:', e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand/About */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Sambeng" className="h-8 w-auto object-contain max-w-[120px] filter brightness-0 invert" />
              ) : null}
              <span>Padukuhan Sambeng</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm">
              Website resmi informasi dan pelayanan Padukuhan Sambeng, Desa Ngalang, Gedangsari, Gunungkidul. Meningkatkan pelayanan warga melalui keterbukaan informasi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profil" className="hover:text-white transition-colors">Profil Dukuh</Link>
              </li>
              <li>
                <Link href="/organisasi" className="hover:text-white transition-colors">Struktur Organisasi</Link>
              </li>
              <li>
                <Link href="/umkm" className="hover:text-white transition-colors">UMKM Sambeng</Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-white transition-colors">Berita Desa</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>Sambeng, Ngalang, Gedangsari, Gunungkidul, DIY</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>info@sambeng.desa.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} KKN Padukuhan Sambeng. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Dibuat dengan dedikasi untuk Desa Ngalang</p>
        </div>
      </div>
    </footer>
  );
}
