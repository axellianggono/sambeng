"use client";

import { useEffect, useState, use } from "react";
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UMKMItem } from "@/lib/data-defaults";
import { Plus, Edit, Trash2, Save, X, Upload, Loader2, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function AdminUMKMPage() {
  const [items, setItems] = useState<UMKMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form States
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const searchParams = useSearchParams();

  const loadUMKM = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "umkm");
      const snap = await getDocs(colRef);
      const list: UMKMItem[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as UMKMItem);
      });
      setItems(list);
    } catch (err) {
      console.error("Failed to load UMKM from Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUMKM();
  }, []);

  // Monitor query params to trigger adding a new item from shortcuts
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      handleOpenNewForm();
    }
  }, [searchParams]);

  const handleOpenNewForm = () => {
    setCurrentId(null);
    setName("");
    setOwner("");
    setCategory("Makanan");
    setDescription("");
    setAddress("");
    setWhatsapp("");
    setImageUrl("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: UMKMItem) => {
    setCurrentId(item.id);
    setName(item.name);
    setOwner(item.owner);
    setCategory(item.category);
    setDescription(item.description);
    setAddress(item.address);
    setWhatsapp(item.whatsapp);
    setImageUrl(item.imageUrl);
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
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto produk.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Clean WhatsApp number format
    // Convert e.g., 0812345678 to 62812345678, remove any "+", spaces, or hyphens
    let cleanedWa = whatsapp.replace(/[^0-9]/g, "");
    if (cleanedWa.startsWith("0")) {
      cleanedWa = "62" + cleanedWa.substring(1);
    } else if (cleanedWa.startsWith("8")) {
      cleanedWa = "62" + cleanedWa;
    }

    const itemData = {
      name,
      owner,
      category,
      description,
      address,
      whatsapp: cleanedWa,
      imageUrl,
    };

    try {
      if (currentId) {
        // Update
        await setDoc(doc(db, "umkm", currentId), itemData);
      } else {
        // Create
        await addDoc(collection(db, "umkm"), itemData);
      }
      setIsFormOpen(false);
      loadUMKM();
    } catch (err) {
      console.error("Failed to save UMKM:", err);
      alert("Gagal menyimpan data ke Firestore.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data UMKM ini?")) return;

    try {
      await deleteDoc(doc(db, "umkm", id));
      loadUMKM();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola UMKM Warga</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola katalog usaha kecil, mikro, dan menengah di Padukuhan Sambeng.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenNewForm}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah UMKM</span>
          </button>
        )}
      </div>

      {/* Editor Form Overlay / Toggle */}
      {isFormOpen ? (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {currentId ? "Edit Data UMKM" : "Tambah UMKM Baru"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Form Fields */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Nama Usaha / Produk</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Contoh: Kripik Singkong Gurih"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Nama Pemilik Usaha</label>
                  <input
                    type="text"
                    required
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Contoh: Ibu Hartini"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Kategori Usaha</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="Makanan">Makanan & Minuman</option>
                    <option value="Kerajinan">Kerajinan Tangan</option>
                    <option value="Kesehatan">Kesehatan & Herbal</option>
                    <option value="Jasa">Jasa</option>
                    <option value="Pertanian">Pertanian / Peternakan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 flex items-center space-x-1">
                    <Phone className="h-3 w-3 text-primary-600" />
                    <span>Nomor WhatsApp (Pembeli bisa chat)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Contoh: 081234567890"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Boleh dimasukkan diawali 08 atau 628.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Alamat Lengkap Usaha</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Contoh: RT 02 / RW 01, Padukuhan Sambeng"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Deskripsi Usaha / Produk</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Ceritakan bahan produk, keunikan, varian rasa, harga, dll..."
                />
              </div>
            </div>

            {/* Right Column: Image Upload */}
            <div className="md:col-span-4 space-y-4">
              <label className="block text-xs font-bold text-gray-700">Foto Usaha / Produk</label>
              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center">
                {imageUrl ? (
                  <>
                    <Image src={imageUrl} alt="Preview UMKM" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md">
                        <Upload className="h-4.5 w-4.5" />
                        <span>Ganti Foto</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-gray-400">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs font-semibold">Pilih Foto Produk</span>
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

            {/* Submit Bar */}
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
                    <span>Simpan Usaha</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* UMKM Listings table/grid */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Belum ada UMKM terdaftar. Klik "+ Tambah UMKM" di atas untuk mendaftarkan usaha warga.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5">Foto</th>
                    <th className="p-5">Nama Usaha</th>
                    <th className="p-5">Pemilik</th>
                    <th className="p-5">Kategori</th>
                    <th className="p-5">WhatsApp</th>
                    <th className="p-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-5">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          <Image src={item.imageUrl || "https://images.unsplash.com/photo-1566847438217-76e82d383f84?q=80&w=400&auto=format&fit=crop"} alt={item.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-5 font-semibold text-gray-900">{item.name}</td>
                      <td className="p-5">{item.owner}</td>
                      <td className="p-5">
                        <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-5">
                        <a
                          href={`https://wa.me/${item.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-500 space-x-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>+{item.whatsapp}</span>
                        </a>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditForm(item)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus"
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
