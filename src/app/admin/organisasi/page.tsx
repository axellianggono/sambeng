"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Organization } from "@/lib/data-defaults";
import { Plus, Edit, Trash2, Save, X, Upload, Loader2, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminOrganisasiPage() {
  const [items, setItems] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form States
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [contact, setContact] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [structure, setStructure] = useState<any[]>([]); // Preserves existing structures on edits

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "organizations");
      const snap = await getDocs(colRef);
      const list: Organization[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Organization);
      });
      setItems(list);
    } catch (err) {
      console.error("Failed to load organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const handleOpenNewForm = () => {
    setCurrentId(null);
    setName("");
    setSlug("");
    setDescription("");
    setVision("");
    setMission("");
    setContact("");
    setLogoUrl("");
    setStructure([]);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (org: Organization) => {
    setCurrentId(org.id);
    setName(org.name);
    setSlug(org.slug);
    setDescription(org.description);
    setVision(org.vision);
    setMission(org.mission);
    setContact(org.contact);
    setLogoUrl(org.logoUrl);
    setStructure(org.structure || []);
    setIsFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setLogoUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah logo.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const generatedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    const orgData = {
      name,
      slug: generatedSlug,
      description,
      vision,
      mission,
      contact,
      logoUrl,
      structure, // Preserve or initialize empty structure
    };

    try {
      if (currentId) {
        await setDoc(doc(db, "organizations", currentId), orgData);
      } else {
        await addDoc(collection(db, "organizations"), orgData);
      }
      setIsFormOpen(false);
      loadOrganizations();
    } catch (err) {
      console.error("Failed to save organization:", err);
      alert("Gagal menyimpan organisasi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus organisasi ini? Bagan strukturnya juga akan hilang.")) return;

    try {
      await deleteDoc(doc(db, "organizations", id));
      loadOrganizations();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Organisasi Warga</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data lembaga, visi misi, serta susunan kepengurusan struktural.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenNewForm}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Organisasi</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {currentId ? "Edit Data Lembaga" : "Daftarkan Lembaga Baru"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Nama Lembaga / Organisasi</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Contoh: PKK Padukuhan Sambeng"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Tautan Custom URL (Slug)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Contoh: pkk-sambeng (Opsional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Kontak Person (Humas/Ketua)</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Contoh: Andi Wijaya (+62 813-2222-3333)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Deskripsi Singkat Lembaga</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Ceritakan peran utama lembaga ini dalam padukuhan..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Visi Organisasi</label>
                  <textarea
                    rows={4}
                    required
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Misi (Gunakan baris baru untuk poin)</label>
                  <textarea
                    rows={4}
                    required
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Logo Upload */}
            <div className="md:col-span-4 space-y-4">
              <label className="block text-xs font-bold text-gray-700">Logo Organisasi</label>
              <div className="relative h-48 w-48 rounded-2xl overflow-hidden bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center mx-auto md:mx-0">
                {logoUrl ? (
                  <>
                    <Image src={logoUrl} alt="Logo Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md">
                        <Upload className="h-4.5 w-4.5" />
                        <span>Ganti Logo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-gray-400">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs font-semibold">Pilih File Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="md:col-span-12 flex justify-end space-x-3 border-t border-gray-100 pt-4 mt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-xl transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Lembaga</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Belum ada lembaga terdaftar. Klik "+ Tambah Organisasi" di atas untuk mendaftarkannya.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5">Logo</th>
                    <th className="p-5">Nama Lembaga</th>
                    <th className="p-5">Slug URL</th>
                    <th className="p-5">Pengurus</th>
                    <th className="p-5">Kelola Anggota</th>
                    <th className="p-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {items.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-5">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          <Image src={org.logoUrl || "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=200&auto=format&fit=crop"} alt={org.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-5 font-semibold text-gray-900">{org.name}</td>
                      <td className="p-5 text-xs font-mono text-gray-500">{org.slug}</td>
                      <td className="p-5 text-xs">
                        <span className="font-semibold text-gray-900">{org.structure?.length || 0}</span> Pengurus
                      </td>
                      <td className="p-5">
                        <Link
                          href={`/admin/organisasi/${org.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-primary-700 hover:text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-100 transition"
                        >
                          <Users className="h-3.5 w-3.5" />
                          <span>Susun Bagan Struktur</span>
                        </Link>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditForm(org)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Edit Info"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(org.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Lembaga"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
