'use client';

import React, { useState, useEffect } from 'react';
import { UMKM } from '@/lib/dummy-data';
import { MapPin, Phone, X, User } from 'lucide-react';
import { getUMKMs } from '@/lib/db';

export default function UMKMPage() {
  const [selectedUMKM, setSelectedUMKM] = useState<UMKM | null>(null);
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Firestore
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const loadedUMKMs = await getUMKMs();
        setUmkms(loadedUMKMs);
      } catch (err) {
        console.error('Gagal memuat data UMKM di halaman publik:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            UMKM Padukuhan Sambeng
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Dukung usaha lokal masyarakat Padukuhan Sambeng. Jelajahi berbagai jenis usaha mulai dari kuliner tradisional, pertanian, hingga kerajinan khas desa.
          </p>
        </div>

        {/* UMKM List Grid */}
        {loading ? (
          <div className="text-center py-20 text-zinc-500 italic">
            Memuat data UMKM...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {umkms.map((umkm) => (
              <div
                key={umkm.id}
                onClick={() => setSelectedUMKM(umkm)}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={umkm.imageUrl}
                      alt={umkm.businessName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {umkm.businessName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                      <User className="h-3.5 w-3.5" />
                      <span>Pemilik: {umkm.ownerName}</span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {umkm.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-350 text-xs font-medium pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{umkm.address}</span>
                  </div>
                </div>
              </div>
            ))}
            {umkms.length === 0 && (
              <div className="col-span-full text-center py-20 text-zinc-400 italic">
                Belum ada data UMKM terdaftar.
              </div>
            )}
          </div>
        )}

        {/* Modal Detail UMKM */}
        {selectedUMKM && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedUMKM(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Body */}
              <div>
                {/* Header Banner */}
                <div className="relative h-64 bg-zinc-200 dark:bg-zinc-800">
                  <img
                    src={selectedUMKM.imageUrl}
                    alt={selectedUMKM.businessName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-8">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {selectedUMKM.businessName}
                      </h2>
                      <p className="text-zinc-300 text-sm mt-1 sm:mt-2 flex items-center gap-1">
                        <User className="h-4 w-4 text-emerald-400" />
                        <span>Pemilik: {selectedUMKM.ownerName}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Tentang Usaha</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {selectedUMKM.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white mb-2 text-sm">Alamat Usaha</h4>
                      <div className="flex items-start gap-2 text-zinc-500 dark:text-zinc-400 text-xs">
                        <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{selectedUMKM.address}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white mb-2 text-sm">Hubungi Penjual</h4>
                      <a
                        href={`https://wa.me/${selectedUMKM.contact}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors w-full justify-center shadow-sm cursor-pointer"
                      >
                        <Phone className="h-4 w-4" />
                        <span>Pesan via WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {selectedUMKM.mapsUrl && (
                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3 animate-in fade-in duration-200">
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Lokasi Usaha (Maps)</h4>
                      <div className="h-60 w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner">
                        <iframe
                          src={selectedUMKM.mapsUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
