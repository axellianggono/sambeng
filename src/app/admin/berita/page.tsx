"use client";

import { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NewsItem } from "@/lib/data-defaults";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Loader2,
  Newspaper,
  Calendar,
  User,
  Eye,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function AdminBeritaPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form States
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kegiatan");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [author, setAuthor] = useState("Admin Padukuhan");

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();

  const loadNews = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "news");
      const snap = await getDocs(colRef);
      const list: NewsItem[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as NewsItem);
      });
      setItems(list);
    } catch (err) {
      console.error("Failed to load news from Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Monitor query params to trigger adding a new item from shortcuts
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      handleOpenNewForm();
    }
  }, [searchParams]);

  const handleOpenNewForm = () => {
    setCurrentId(null);
    setTitle("");
    setCategory("Kegiatan");
    setSummary("");
    setContent("");
    setThumbnailUrl("");
    setStatus("published");
    setAuthor("Admin Padukuhan");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (news: NewsItem) => {
    setCurrentId(news.id);
    setTitle(news.title);
    setCategory(news.category);
    setSummary(news.summary);
    setContent(news.content);
    setThumbnailUrl(news.thumbnailUrl);
    setStatus(news.status);
    setAuthor(news.author);
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
      setThumbnailUrl(data.url);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah thumbnail berita.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Helper to insert HTML tags at cursor position
  const insertHTMLTag = (tagOpen: string, tagClose: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + selected + tagClose;

    setContent(text.substring(0, start) + replacement + text.substring(end));
    
    // Reset focus and cursor position after React re-renders
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Create a clean URL slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-") // collapse double hyphens
      .trim();

    const newsData = {
      title,
      slug,
      category,
      summary,
      content,
      thumbnailUrl,
      status,
      author,
      publishedAt: new Date().toISOString(),
    };

    try {
      if (currentId) {
        await setDoc(doc(db, "news", currentId), newsData);
      } else {
        await addDoc(collection(db, "news"), newsData);
      }
      setIsFormOpen(false);
      loadNews();
    } catch (err) {
      console.error("Failed to save news:", err);
      alert("Gagal menyimpan data ke Firestore.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;

    try {
      await deleteDoc(doc(db, "news", id));
      loadNews();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus berita.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kelola Berita Padukuhan</h1>
          <p className="text-sm text-gray-500 mt-1">Buat, sunting, dan publikasikan informasi kegiatan padukuhan.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenNewForm}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            <span>Tulis Berita</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {currentId ? "Edit Berita" : "Tulis Berita Baru"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Form Fields */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Judul Berita / Artikel</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Contoh: Kerja Bakti Massal Sambeng"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="Kegiatan">Kegiatan Warga</option>
                    <option value="Pengumuman">Pengumuman Resmi</option>
                    <option value="Prestasi">Prestasi Padukuhan</option>
                    <option value="Opini">Kilas Budaya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Penulis / Kontributor</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700">Status Artikel</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="published">Langsung Publikasikan</option>
                    <option value="draft">Simpan Sebagai Draft (Sembunyikan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700">Ringkasan Singkat (Muncul di Halaman Utama)</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  placeholder="Deskripsi singkat isi berita dalam 1-2 kalimat..."
                />
              </div>

              {/* Light rich text editor toolbar */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Isi Konten Berita</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Toolbar */}
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => insertHTMLTag("<strong>", "</strong>")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Tebal (Bold)"
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHTMLTag("<em>", "</em>")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Miring (Italic)"
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHTMLTag("<h2>", "</h2>")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Heading 2"
                    >
                      <Heading2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHTMLTag("<h3>", "</h3>")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Heading 3"
                    >
                      <Heading3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHTMLTag("<ul>\n  <li>", "</li>\n</ul>")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Daftar Poin (List)"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHTMLTag("<blockquote>", "</blockquote>")}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                      title="Kutipan (Blockquote)"
                    >
                      <Quote className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 focus:outline-none text-sm leading-relaxed"
                    placeholder="Tulis artikel berita disini. Gunakan toolbar diatas untuk memformat teks..."
                  />
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              {content && (
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Pratinjau Hasil Format</span>
                  <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-150 rich-content max-h-56 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                </div>
              )}
            </div>

            {/* Right Fields: Image Thumbnail */}
            <div className="md:col-span-4 space-y-4">
              <label className="block text-xs font-bold text-gray-700">Foto Thumbnail Berita</label>
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center">
                {thumbnailUrl ? (
                  <>
                    <Image src={thumbnailUrl} alt="Thumbnail Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md">
                        <Upload className="h-4.5 w-4.5" />
                        <span>Ganti Gambar</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center p-6 text-gray-400">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs font-semibold">Pilih Foto Banner</span>
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
                    <span>Simpan Berita</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* News list view */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Belum ada berita ditulis. Klik "+ Tulis Berita" di atas untuk mempublikasikan artikel pertama.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5">Gambar</th>
                    <th className="p-5">Judul Berita</th>
                    <th className="p-5">Kategori</th>
                    <th className="p-5">Penulis</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {items.map((news) => (
                    <tr key={news.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-5">
                        <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          <Image src={news.thumbnailUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop"} alt={news.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-5 font-semibold text-gray-900 truncate max-w-xs">{news.title}</td>
                      <td className="p-5">
                        <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase">
                          {news.category}
                        </span>
                      </td>
                      <td className="p-5 text-xs">{news.author}</td>
                      <td className="p-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          news.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {news.status === "published" ? "Publik" : "Draft"}
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditForm(news)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(news.id)}
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
