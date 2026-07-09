'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { News, User } from '@/lib/dummy-data';
import { Plus, Trash2, FileText, Globe, Eye, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { uploadImage } from '@/lib/upload';

// Reusable component imports
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

// Firestore database service imports
import { getNews, saveNewsItem, deleteNewsItem } from '@/lib/db';

// Dynamically import ReactQuill to prevent Next.js SSR errors
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-40 bg-zinc-50 border border-zinc-200 rounded-xl animate-pulse" />,
});

import 'react-quill-new/dist/quill.snow.css';

export default function BeritaManagementPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    imageUrl: '',
    isPublished: true,
  });

  const [showSavedToast, setShowSavedToast] = useState(false);
  const [uploadingNewsImage, setUploadingNewsImage] = useState(false);

  // Custom Confirm Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
  });

  // Load from Firestore and localStorage
  useEffect(() => {
    // Load currentUser from localStorage
    const savedUser = localStorage.getItem('sambeng_admin_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Gagal membaca data sesi admin:', err);
      }
    }

    async function loadData() {
      setLoading(true);
      try {
        const loadedNews = await getNews();
        setNewsList(loadedNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      } catch (err) {
        console.error('Gagal memuat berita dari Firestore:', err);
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

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // collapse multiple hyphens
    
    setFormData({
      ...formData,
      title,
      slug,
    });
  };

  // Add new article
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const newArticle: News = {
      id: `news-${Date.now()}`,
      title: formData.title,
      slug: formData.slug || 'judul-berita-baru',
      content: formData.content,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&auto=format&fit=crop&q=60',
      authorId: currentUser?.id || 'user-1',
      authorName: currentUser?.name || 'Budi Santoso',
      publishedAt: new Date().toISOString(),
      isPublished: formData.isPublished,
    };

    setLoading(true);
    try {
      await saveNewsItem(newArticle);
      const updated = await getNews();
      setNewsList(updated.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      setFormData({
        title: '',
        slug: '',
        content: '',
        imageUrl: '',
        isPublished: true,
      });
      setShowAddForm(false);
      triggerSaveNotification();
    } catch (err) {
      alert('Gagal mempublikasikan berita di Firestore');
    } finally {
      setLoading(false);
    }
  };

  // Delete article
  const handleDeleteNewsClick = (article: News) => {
    setConfirmState({
      isOpen: true,
      title: 'Hapus Berita?',
      message: `Apakah Anda yakin ingin menghapus artikel berita "${article.title}" secara permanen di Firestore?`,
      type: 'danger',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          await deleteNewsItem(article.id);
          const updated = await getNews();
          setNewsList(updated.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
          triggerSaveNotification();
        } catch (err) {
          alert('Gagal menghapus berita di Firestore');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Toggle Publish Status
  const togglePublish = (article: News) => {
    setConfirmState({
      isOpen: true,
      title: article.isPublished ? 'Arsipkan Berita?' : 'Terbitkan Berita?',
      message: `Apakah Anda yakin ingin ${article.isPublished ? 'menyembunyikan' : 'menayangkan'} artikel "${article.title}" di halaman publik?`,
      type: 'info',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          const updatedItem = { ...article, isPublished: !article.isPublished };
          await saveNewsItem(updatedItem);
          const updated = await getNews();
          setNewsList(updated.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
          triggerSaveNotification();
        } catch (err) {
          alert('Gagal memperbarui status publikasi berita');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Upload News Image
  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNewsImage(true);
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah gambar berita');
    } finally {
      setUploadingNewsImage(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl relative">
      
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">Perubahan berhasil disimpan ke Firestore!</span>
        </div>
      )}

      {/* Reusable ConfirmModal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Kelola Kabar Berita</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Tulis berita kegiatan dukuh, program KKN, atau pengumuman penting bagi warga (Firestore Mode).
          </p>
        </div>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="primary"
            icon={<Plus className="h-4.5 w-4.5" />}
            disabled={loading}
          >
            Tulis Berita Baru
          </Button>
        )}
      </div>

      {/* Write News Form */}
      {showAddForm && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-250 pb-3">
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span>Tulis Artikel Berita Baru</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 cursor-pointer"
            >
              Tutup
            </button>
          </div>

          <form onSubmit={handleAddNews} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Judul Berita"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Kerja Bakti Massal Sambeng..."
              />
              <Input
                label="Slug URL (Otomatis)"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="kerja-bakti-massal-sambeng"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">Unggah Foto Berita</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleNewsImageUpload}
                disabled={uploadingNewsImage}
                className="w-full text-xs text-zinc-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer disabled:opacity-50"
              />
              {uploadingNewsImage && <p className="text-xs text-emerald-600 mt-1 animate-pulse">Mengunggah gambar...</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">Isi Konten Berita</label>
              <div className="prose max-w-none">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Ketik konten artikel secara lengkap di sini..."
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['clean'],
                    ],
                  }}
                  className="bg-white rounded-xl overflow-hidden border border-zinc-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 py-2">
              <input
                type="checkbox"
                id="publishCheckbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4.5 w-4.5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="publishCheckbox" className="text-xs font-semibold text-zinc-650 cursor-pointer">
                Terbitkan sekarang (Dapat dibaca oleh publik)
              </label>
            </div>

            <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowAddForm(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
              >
                Simpan & Terbitkan
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* News Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Th>Judul / Info Berita</Th>
            <Th>Tanggal Terbit</Th>
            <Th className="text-center">Status</Th>
            <Th className="text-center">Aksi</Th>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                  Menghubungi Firestore...
                </Td>
              </Tr>
            ) : newsList.map((news) => (
              <Tr key={news.id}>
                <Td>
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-zinc-900 text-sm line-clamp-1 max-w-sm" title={news.title}>
                        {news.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-1">
                        Oleh: {news.authorName}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td className="font-medium text-zinc-550">
                  {new Date(news.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Td>
                <Td>
                  <div className="flex justify-center">
                    <button
                      onClick={() => togglePublish(news)}
                      className={`inline-flex items-center gap-1 py-1 px-3.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        news.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-600 hover:text-white'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-500 hover:text-white'
                      }`}
                    >
                      {news.isPublished ? (
                        <>
                          <Globe className="h-3 w-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Draft (Hidden)</span>
                        </>
                      )}
                    </button>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/berita/${news.slug}`}
                      target="_blank"
                      className="p-2 text-zinc-400 hover:text-zinc-650 transition-colors"
                      title="Pratinjau Halaman"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteNewsClick(news)}
                      className="p-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus Berita"
                      disabled={loading}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
            }
            {!loading && newsList.length === 0 && (
              <Tr>
                <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                  Belum ada artikel berita ditulis. Silakan tulis kabar pertama di atas!
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

    </div>
  );
}
