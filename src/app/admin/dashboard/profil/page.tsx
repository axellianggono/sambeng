'use client';

import React, { useState, useEffect } from 'react';
import { dummyProfile as initialProfile, Statistic, VillageProfile } from '@/lib/dummy-data';
import { Plus, Trash2, Save, Landmark, LayoutGrid, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/upload';

import { getVillageProfile, saveVillageProfile } from '@/lib/db';

export default function ProfilManagementPage() {
  const [profile, setProfile] = useState<VillageProfile>(initialProfile);
  const [newStat, setNewStat] = useState<Statistic>({ category: '', detail: '' });
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from Firestore on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const loaded = await getVillageProfile();
        setProfile(loaded);
      } catch (err) {
        console.error('Gagal memuat profil desa dari Firestore:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const triggerSaveNotification = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Helper to update state and Firestore
  const saveProfileData = async (updated: VillageProfile) => {
    setProfile(updated);
    setLoading(true);
    try {
      await saveVillageProfile(updated);
      triggerSaveNotification();
    } catch (err) {
      alert('Gagal menyimpan profil desa di Firestore');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDescription = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData({
      ...profile,
      description: profile.description
    });
  };

  // Add a new dynamic statistic
  const handleAddStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStat.category || !newStat.detail) return;
    
    const updated = {
      ...profile,
      statistics: [...profile.statistics, newStat],
    };
    saveProfileData(updated);
    setNewStat({ category: '', detail: '' });
  };

  // Delete a statistic
  const handleDeleteStat = (idxToDelete: number) => {
    const updated = {
      ...profile,
      statistics: profile.statistics.filter((_, idx) => idx !== idxToDelete),
    };
    saveProfileData(updated);
  };

  // Upload photo to gallery
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    try {
      const url = await uploadImage(file);
      const updated = {
        ...profile,
        gallery: [...profile.gallery, url],
      };
      saveProfileData(updated);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah foto');
    } finally {
      setUploadingGallery(false);
      // Clear input
      e.target.value = '';
    }
  };

  // Delete photo from gallery
  const handleDeleteGallery = (idxToDelete: number) => {
    const updated = {
      ...profile,
      gallery: profile.gallery.filter((_, idx) => idx !== idxToDelete),
    };
    saveProfileData(updated);
  };

  // Upload Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadImage(file);
      const updated = {
        ...profile,
        logoUrl: url,
      };
      saveProfileData(updated);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Delete Logo
  const handleDeleteLogo = () => {
    const updated = {
      ...profile,
      logoUrl: '',
    };
    saveProfileData(updated);
  };

  return (
    <div className="space-y-8 max-w-5xl relative">
      
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">Perubahan berhasil disimpan! (Perubahan langsung ter-update di publik)</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Kelola Profil Padukuhan</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Perbarui sejarah desa, logo kustom website, kelola data statistik secara dinamis, dan galeri foto padukuhan.
        </p>
      </div>

      {/* Customizable Logo Form */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-emerald-600" />
          <span>Kustomisasi Logo Padukuhan</span>
        </h3>
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          Secara default, website tidak memuat gambar logo (hanya teks merek &ldquo;Sambeng&rdquo;). Unggah gambar logo desa di bawah ini untuk menampilkan logo kustom di navigasi atas dan bawah.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Pilih File Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer disabled:opacity-50"
              />
              {uploadingLogo && <p className="text-xs text-emerald-600 mt-1 animate-pulse">Mengunggah logo...</p>}
            </div>
            {profile.logoUrl && (
              <div>
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  className="flex items-center gap-1.5 py-2 px-4 bg-zinc-100 hover:bg-red-50 hover:text-red-600 text-zinc-600 rounded-xl text-xs font-bold transition-all border border-zinc-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Hapus Logo</span>
                </button>
              </div>
            )}
          </div>

          {/* Logo Preview */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-4">Pratinjau Logo</p>
            {profile.logoUrl ? (
              <div className="bg-white p-4 rounded-xl flex items-center justify-center max-w-[150px] max-h-[100px] border border-zinc-200">
                <img src={profile.logoUrl} alt="Desa Logo Preview" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="text-xs text-zinc-500 italic leading-relaxed">
                Logo tidak diatur<br/>(Menggunakan brand teks)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description Form */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
          <Landmark className="h-5 w-5 text-emerald-600" />
          <span>Deskripsi & Sejarah Padukuhan</span>
        </h3>
        <form onSubmit={handleSaveDescription} className="space-y-4">
          <textarea
            rows={6}
            value={profile.description}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 transition-all resize-none leading-relaxed font-medium"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Deskripsi</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dynamic Statistics Manager */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-emerald-600" />
          <span>Kelola Statistik Desa (Dinamis)</span>
        </h3>

        {/* List of statistics with delete button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {profile.statistics.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-2xl group"
            >
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase">{stat.category}</p>
                <p className="text-lg font-extrabold text-zinc-800 mt-0.5">{stat.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteStat(idx)}
                className="p-2 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Hapus Statistik"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {profile.statistics.length === 0 && (
            <div className="col-span-full text-center py-6 text-zinc-400 italic text-xs bg-zinc-50 border border-zinc-200/80 rounded-2xl">
              Belum ada data statistik kependudukan.
            </div>
          )}
        </div>

        {/* Form to add a new statistic */}
        <form onSubmit={handleAddStat} className="bg-zinc-50 p-6 border border-zinc-200/80 rounded-2xl shadow-inner">
          <p className="text-xs font-bold text-zinc-500 mb-4 uppercase">Tambah Statistik Baru</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Kategori</label>
              <input
                type="text"
                required
                value={newStat.category}
                onChange={(e) => setNewStat({ ...newStat, category: e.target.value })}
                placeholder="Contoh: Jumlah Ternak Sapi"
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase">Keterangan / Detail</label>
              <input
                type="text"
                required
                value={newStat.detail}
                onChange={(e) => setNewStat({ ...newStat, detail: e.target.value })}
                placeholder="Contoh: 145 Ekor"
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 py-1.5 px-4 bg-white hover:bg-emerald-600 hover:text-white border border-zinc-300 hover:border-transparent text-zinc-650 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Manager */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 mb-6">Kelola Galeri Foto</h3>

        {/* Grid Preview of Photos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {profile.gallery.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-video bg-zinc-100 border border-zinc-200 rounded-xl overflow-hidden group"
            >
              <img src={url} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => handleDeleteGallery(idx)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                  title="Hapus Foto"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add photo file form */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Unggah Foto Baru</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              disabled={uploadingGallery}
              className="w-full text-sm text-zinc-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer disabled:opacity-50"
            />
          </div>
          {uploadingGallery && <span className="text-xs text-emerald-600 animate-pulse shrink-0 self-end mb-2">Mengunggah foto...</span>}
        </div>
      </div>
    </div>
  );
}
