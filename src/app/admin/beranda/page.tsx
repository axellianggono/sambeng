"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_SETTINGS, SystemSettings } from "@/lib/data-defaults";
import { Save, Loader2, Upload, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function AdminBerandaPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Image Upload Loading States
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingDukuh, setUploadingDukuh] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, "settings", "beranda");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() });
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "hero" | "dukuh") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === "hero") setUploadingHero(true);
    else setUploadingDukuh(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (settings) {
        if (target === "hero") {
          setSettings({ ...settings, heroImageUrl: data.url });
        } else {
          setSettings({ ...settings, dukuhImageUrl: data.url });
        }
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setUploadingHero(false);
      setUploadingDukuh(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccessMsg("");

    try {
      await setDoc(doc(db, "settings", "beranda"), settings);
      setSuccessMsg("Berhasil menyimpan perubahan data beranda!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Gagal menyimpan perubahan ke Firestore.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatChange = (idx: number, field: "label" | "value", val: string) => {
    if (!settings) return;
    const newStats = [...settings.stats];
    newStats[idx] = { ...newStats[idx], [field]: val };
    setSettings({ ...settings, stats: newStats });
  };

  if (loading || !settings) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Beranda & Profil</h1>
          <p className="text-sm text-gray-500 mt-1">Ubah konten banner hero, sambutan dukuh, visi misi, dan statistik padukuhan.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-semibold flex items-center space-x-2 animate-bounce">
            <CheckCircle className="h-5 w-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SECTION 1: HERO BANNER */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">1. Banner Hero Beranda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Judul Banner Utama</label>
                <input
                  type="text"
                  required
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Sub-judul Banner</label>
                <textarea
                  rows={3}
                  required
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            {/* Hero Image Preview & Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Foto Latar Banner</label>
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center">
                {settings.heroImageUrl ? (
                  <>
                    <Image src={settings.heroImageUrl} alt="Hero Banner Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md">
                        <Upload className="h-4.5 w-4.5" />
                        <span>Ganti Foto</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "hero")} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-gray-400">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs font-semibold">Pilih File Foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "hero")} />
                  </label>
                )}
                {uploadingHero && (
                  <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SAMBUTAN DUKUH */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">2. Sambutan Kepala Dukuh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Nama Lengkap Dukuh</label>
                <input
                  type="text"
                  required
                  value={settings.dukuhName}
                  onChange={(e) => setSettings({ ...settings, dukuhName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Isi Pesan Sambutan</label>
                <textarea
                  rows={5}
                  required
                  value={settings.dukuhGreeting}
                  onChange={(e) => setSettings({ ...settings, dukuhGreeting: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            {/* Dukuh Image Preview & Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Foto Dukuh</label>
              <div className="relative h-64 w-48 rounded-xl overflow-hidden bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center mx-auto md:mx-0">
                {settings.dukuhImageUrl ? (
                  <>
                    <Image src={settings.dukuhImageUrl} alt="Dukuh Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md">
                        <Upload className="h-4.5 w-4.5" />
                        <span>Ganti Foto</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "dukuh")} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-gray-400">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs font-semibold">Pilih Foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "dukuh")} />
                  </label>
                )}
                {uploadingDukuh && (
                  <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: PROFIL SEJARAH & VISI MISI */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">3. Profil Lengkap, Sejarah & Visi Misi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Ringkasan Profil (Beranda)</label>
              <textarea
                rows={3}
                required
                value={settings.profileSummary}
                onChange={(e) => setSettings({ ...settings, profileSummary: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Sejarah Lengkap Padukuhan</label>
              <textarea
                rows={6}
                required
                value={settings.profileHistory}
                onChange={(e) => setSettings({ ...settings, profileHistory: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Visi Padukuhan</label>
                <textarea
                  rows={4}
                  required
                  value={settings.profileVision}
                  onChange={(e) => setSettings({ ...settings, profileVision: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Misi Padukuhan (Gunakan baris baru untuk poin)</label>
                <textarea
                  rows={4}
                  required
                  value={settings.profileMission}
                  onChange={(e) => setSettings({ ...settings, profileMission: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: STATISTIK */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">4. Baris Data Statistik Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.stats.map((stat, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-primary-700 uppercase tracking-widest">
                  Statistik #{idx + 1}
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase">Label</label>
                  <input
                    type="text"
                    required
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    className="mt-1 block w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase">Nilai/Jumlah</label>
                  <input
                    type="text"
                    required
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    className="mt-1 block w-full px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-700/20 transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Simpan Seluruh Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
