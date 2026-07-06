'use client';

import React, { useState, useEffect } from 'react';
import { UMKM } from '@/lib/dummy-data';
import { Plus, Trash2, Edit, Store, Phone, MapPin } from 'lucide-react';
import { uploadImage } from '@/lib/upload';

// Component Based imports
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Input, TextArea } from '@/components/ui/Input';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

// Firestore database imports
import {
  getUMKMs,
  saveUMKM,
  deleteUMKM,
} from '@/lib/db';

export default function UMKMManagementPage() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUmkmId, setSelectedUmkmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    description: '',
    address: '',
    contact: '',
    imageUrl: '',
    mapsUrl: '',
  });

  const [uploadingBanner, setUploadingBanner] = useState(false);

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

  // Load from Firestore
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const loadedUmkm = await getUMKMs();
        setUmkms(loadedUmkm);
      } catch (err) {
        console.error('Gagal memuat data UMKM dari Firestore:', err);
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

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      businessName: '',
      ownerName: '',
      description: '',
      address: '',
      contact: '628',
      imageUrl: '',
      mapsUrl: '',
    });
    setModalMode('create');
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (umkm: UMKM) => {
    setFormData({
      businessName: umkm.businessName,
      ownerName: umkm.ownerName,
      description: umkm.description || '',
      address: umkm.address || '',
      contact: umkm.contact,
      imageUrl: umkm.imageUrl || '',
      mapsUrl: umkm.mapsUrl || '',
    });
    setSelectedUmkmId(umkm.id);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Form Submit for UMKM
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.ownerName) return;

    if (modalMode === 'create') {
      const newObj: UMKM = {
        id: `umkm-${Date.now()}`,
        ownerName: formData.ownerName,
        businessName: formData.businessName,
        description: formData.description,
        address: formData.address,
        contact: formData.contact,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=60',
        createdAt: new Date().toISOString(),
        mapsUrl: formData.mapsUrl || undefined,
      };
      
      setLoading(true);
      try {
        await saveUMKM(newObj);
        const updated = await getUMKMs();
        setUmkms(updated);
        triggerSaveNotification();
      } catch (err) {
        alert('Gagal membuat profil UMKM di Firestore');
      } finally {
        setLoading(false);
      }
      setModalOpen(false);
    } else if (modalMode === 'edit' && selectedUmkmId) {
      setConfirmState({
        isOpen: true,
        title: 'Simpan Perubahan UMKM',
        message: `Apakah Anda yakin ingin memperbarui data profil UMKM "${formData.businessName}"?`,
        type: 'info',
        onConfirm: async () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          setLoading(true);
          try {
            await saveUMKM({
              id: selectedUmkmId,
              businessName: formData.businessName,
              ownerName: formData.ownerName,
              description: formData.description,
              address: formData.address,
              contact: formData.contact,
              imageUrl: formData.imageUrl,
              createdAt: new Date().toISOString(),
              mapsUrl: formData.mapsUrl || undefined,
            });
            const updated = await getUMKMs();
            setUmkms(updated);
            triggerSaveNotification();
          } catch (err) {
            alert('Gagal memperbarui profil UMKM di Firestore');
          } finally {
            setLoading(false);
          }
          setModalOpen(false);
        },
      });
    }
  };

  // Delete UMKM
  const handleDeleteUmkmClick = (umkm: UMKM) => {
    setConfirmState({
      isOpen: true,
      title: 'Hapus UMKM?',
      message: `Apakah Anda yakin ingin menghapus profil usaha "${umkm.businessName}"? Tindakan ini permanen di Firestore!`,
      type: 'danger',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          await deleteUMKM(umkm.id);
          const updatedUmkm = await getUMKMs();
          setUmkms(updatedUmkm);
          triggerSaveNotification();
        } catch (err) {
          alert('Gagal menghapus UMKM dari Firestore');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Upload UMKM Banner
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah gambar banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl relative">
      
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Kelola Daftar UMKM</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Daftarkan unit usaha mikro warga dukuh dan perbarui data alamat kontak mereka (Firestore Mode).
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          variant="primary"
          icon={<Store className="h-4.5 w-4.5" />}
          disabled={loading}
        >
          Tambah Usaha (UMKM)
        </Button>
      </div>

      {/* Reusable Table Container & Table components */}
      <TableContainer>
        <Table>
          <Thead>
            <Th>Nama Usaha / Banner</Th>
            <Th>Pemilik</Th>
            <Th>Kontak / Alamat</Th>
            <Th className="text-center">Aksi</Th>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                  Menghubungi Firestore...
                </Td>
              </Tr>
            ) : umkms.map((u) => (
              <Tr key={u.id}>
                <Td>
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-20 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                      <img src={u.imageUrl} alt={u.businessName} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-extrabold text-zinc-900 text-sm">{u.businessName}</h4>
                  </div>
                </Td>
                <Td className="font-bold text-zinc-700">{u.ownerName}</Td>
                <Td>
                  <p className="font-semibold text-zinc-750 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <span>+{u.contact}</span>
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{u.address}</span>
                  </p>
                </Td>
                <Td>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-2 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
                      title="Edit Profil Usaha"
                      disabled={loading}
                    >
                      <Edit className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUmkmClick(u)}
                      className="p-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus Profil Usaha"
                      disabled={loading}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
            {!loading && umkms.length === 0 && (
              <Tr>
                <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                  Belum ada UMKM terdaftar. Daftarkan usaha warga di atas!
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Reusable Modal & Form inputs */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? 'Tambah Profil UMKM Baru' : 'Edit Profil Usaha'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Usaha / Merek"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Contoh: Kripik Tempe Jaya"
            />
            <Input
              label="Nama Pemilik"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="Contoh: Ibu Marni"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="No. WhatsApp (Gunakan 62)"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Contoh: 628123456789"
            />
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">Unggah Banner Usaha</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                disabled={uploadingBanner}
                className="w-full text-xs text-zinc-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer disabled:opacity-50"
              />
              {uploadingBanner && <p className="text-xs text-emerald-600 mt-1 animate-pulse">Mengunggah banner...</p>}
            </div>
          </div>

          <Input
            label="Alamat Lengkap Usaha"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Contoh: RT 01 / RW 02, Padukuhan Sambeng"
          />

          <Input
            label="Link Google Maps (URL Iframe Embed src)"
            value={formData.mapsUrl}
            onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
            placeholder="Contoh: https://www.google.com/maps/embed?pb=..."
          />

          <TextArea
            label="Deskripsi Ringkas"
            rows={2}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ceritakan sejarah singkat atau jenis produk kuliner/kerajinan dari usaha ini..."
          />

          <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
