"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EventItem } from "@/lib/data-defaults";
import { Plus, Edit, Trash2, Save, X, Upload, Loader2, Calendar, MapPin, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function AdminAcaraPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form States
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const searchParams = useSearchParams();

  const loadEvents = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "events");
      const snap = await getDocs(colRef);
      const list: EventItem[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as EventItem);
      });
      setItems(list);
    } catch (err) {
      console.error("Failed to load events from Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Monitor query params to trigger adding a new item from shortcuts
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      handleOpenNewForm();
    }
  }, [searchParams]);

  // Helper to convert ISO/Standard Date to local datetime-local value (YYYY-MM-DDTHH:MM)
  const toLocalISOString = (dateInput: string | undefined): string => {
    if (!dateInput) return "";
    try {
      const date = new Date(dateInput);
      const tzoffset = date.getTimezoneOffset() * 60000;
      const localISOTime = new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
      return localISOTime;
    } catch (e) {
      return "";
    }
  };

  const handleOpenNewForm = () => {
    setCurrentId(null);
    setTitle("");
    setDescription("");
    setLocation("");
    // Pre-fill tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setStartDate(toLocalISOString(tomorrow.toISOString()));
    tomorrow.setHours(12, 0, 0, 0);
    setEndDate(toLocalISOString(tomorrow.toISOString()));
    setImageUrl("");
    setIsVisible(true);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (event: EventItem) => {
    setCurrentId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location);
    setStartDate(toLocalISOString(event.startDate));
    setEndDate(toLocalISOString(event.endDate));
    setImageUrl(event.imageUrl);
    setIsVisible(event.isVisible);
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
      alert("Gagal mengunggah foto acara.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const eventData = {
      title,
      description,
      location,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      imageUrl,
      isVisible,
    };

    try {
      if (currentId) {
        await setDoc(doc(db, "events", currentId), eventData);
      } else {
        await addDoc(collection(db, "events"), eventData);
      }
      setIsFormOpen(false);
      loadEvents();
    } catch (err) {
      console.error("Failed to save event:", err);
      alert("Gagal menyimpan data ke Firestore.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus agenda acara ini?")) return;

    try {
      await deleteDoc(doc(db, "events", id));
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data.");
    }
  };

  const toggleVisibility = async (event: EventItem) => {
    try {
      await setDoc(doc(db, "events", event.id), {
        ...event,
        isVisible: !event.isVisible,
      });
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Agenda Acara</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola jadwal, pengumuman, dan agenda kegiatan padukuhan.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenNewForm}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Agenda</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {currentId ? "Edit Agenda Acara" : "Buat Agenda Acara Baru"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Fields */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700">Judul Kegiatan / Acara</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Contoh: Sosialisasi Pencegahan Stunting"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Tanggal & Jam Mulai</label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Tanggal & Jam Selesai</label>
                  <input
                    type="datetime-local"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Tempat Pelaksanaan</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Contoh: Balai Padukuhan Sambeng"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={(e) => setIsVisible(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    <span className="ms-3 text-sm font-semibold text-gray-700">Tampilkan ke Publik</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Deskripsi / Detail Acara</label>
                <textarea
                  rows={5}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Tulis agenda rapat, rundown singkat, atau persyaratan peserta acara..."
                />
              </div>
            </div>

            {/* Right Fields: Image Upload */}
            <div className="md:col-span-4 space-y-4">
              <label className="block text-xs font-bold text-gray-700">Poster / Gambar Acara</label>
              <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center">
                {imageUrl ? (
                  <>
                    <Image src={imageUrl} alt="Preview Poster Acara" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md">
                        <Upload className="h-4.5 w-4.5" />
                        <span>Ganti Poster</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-gray-400">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs font-semibold">Pilih Poster Acara</span>
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
                    <span>Simpan Agenda</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Event Listings */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Belum ada agenda terdaftar. Klik "+ Buat Agenda" di atas untuk membuat jadwal baru.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5">Gambar</th>
                    <th className="p-5">Nama Kegiatan</th>
                    <th className="p-5">Waktu Mulai</th>
                    <th className="p-5">Lokasi</th>
                    <th className="p-5">Status Publik</th>
                    <th className="p-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {items.map((event) => {
                    const startStr = new Date(event.startDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) + " " + new Date(event.startDate).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) + " WIB";

                    return (
                      <tr key={event.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-5">
                          <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                            <Image src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop"} alt={event.title} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="p-5 font-semibold text-gray-900">{event.title}</td>
                        <td className="p-5 text-xs">{startStr}</td>
                        <td className="p-5 text-xs">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <button
                            onClick={() => toggleVisibility(event)}
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
                              event.isVisible
                                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                : "bg-gray-50 border-gray-100 text-gray-400"
                            }`}
                            title="Klik untuk ubah visibilitas publik"
                          >
                            {event.isVisible ? (
                              <>
                                <Eye className="h-3 w-3" />
                                <span>Tampil</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>Sembunyi</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditForm(event)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
