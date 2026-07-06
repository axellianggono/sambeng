'use client';

import React, { useState, useEffect } from 'react';
import { Organization } from '@/lib/dummy-data';
import { Plus, Trash2, Edit, Network, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Component Based imports
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Input, TextArea } from '@/components/ui/Input';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

// Firestore database imports
import {
  getOrganizations,
  getOrganizationDetails,
  saveOrganization,
  deleteOrganization,
} from '@/lib/db';

export default function OrganisasiManagementPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

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
        const loadedOrgs = await getOrganizations();
        const loadedDetails = await getOrganizationDetails();
        setOrgs(loadedOrgs);
        setDetails(loadedDetails);
      } catch (err) {
        console.error('Gagal memuat data dari Firestore:', err);
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
    setFormData({ name: '', description: '' });
    setModalMode('create');
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (org: Organization) => {
    setFormData({ name: org.name, description: org.description || '' });
    setSelectedOrgId(org.id);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Form Submit (Create / Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (modalMode === 'create') {
      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        name: formData.name,
        description: formData.description,
      };
      
      setLoading(true);
      try {
        await saveOrganization(newOrg);
        const updated = await getOrganizations();
        setOrgs(updated);
        triggerSaveNotification();
      } catch (err) {
        alert('Gagal membuat organisasi di Firestore');
      } finally {
        setLoading(false);
      }
      setModalOpen(false);
    } else if (modalMode === 'edit' && selectedOrgId) {
      setConfirmState({
        isOpen: true,
        title: 'Konfirmasi Pembaruan',
        message: `Apakah Anda yakin ingin memperbarui data organisasi "${formData.name}"?`,
        type: 'info',
        onConfirm: async () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          setLoading(true);
          try {
            await saveOrganization({
              id: selectedOrgId,
              name: formData.name,
              description: formData.description,
            });
            const updated = await getOrganizations();
            setOrgs(updated);
            triggerSaveNotification();
          } catch (err) {
            alert('Gagal mengubah organisasi di Firestore');
          } finally {
            setLoading(false);
          }
          setModalOpen(false);
        },
      });
    }
  };

  // Delete Organization
  const handleDeleteOrgClick = (org: Organization) => {
    setConfirmState({
      isOpen: true,
      title: 'Hapus Organisasi?',
      message: `Apakah Anda yakin ingin menghapus "${org.name}"? Semua data kepengurusan dan bagan di dalamnya akan terhapus dari Firestore secara permanen!`,
      type: 'danger',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          await deleteOrganization(org.id);
          const updatedOrgs = await getOrganizations();
          const updatedDetails = await getOrganizationDetails();
          setOrgs(updatedOrgs);
          setDetails(updatedDetails);
          triggerSaveNotification();
        } catch (err) {
          alert('Gagal menghapus organisasi di Firestore');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="space-y-8 max-w-5xl relative">
      
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">Perubahan berhasil disimpan ke database Firestore!</span>
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Kelola Data Organisasi</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Daftarkan lembaga dukuh, edit info ringkas, dan atur struktur bagan organisasi masing-masing (Firestore Mode).
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          variant="primary"
          icon={<Plus className="h-4.5 w-4.5" />}
          disabled={loading}
        >
          Tambah Organisasi
        </Button>
      </div>

      {/* Reusable Table Container & Table components */}
      <TableContainer>
        <Table>
          <Thead>
            <Th>Nama Lembaga</Th>
            <Th>Deskripsi</Th>
            <Th className="text-center">Jumlah Pengurus</Th>
            <Th className="text-center">Aksi</Th>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                  Menghubungi Firestore...
                </Td>
              </Tr>
            ) : orgs.length === 0 ? (
              <Tr>
                <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                  Belum ada lembaga terdaftar. Silakan buat yang pertama!
                </Td>
              </Tr>
            ) : (
              orgs.map((org) => {
                const memberCount = details.filter((d) => d.orgId === org.id).length;
                return (
                <Tr key={org.id}>
                  <Td className="font-extrabold text-zinc-900">{org.name}</Td>
                  <Td className="font-medium text-zinc-500 max-w-xs truncate" title={org.description}>
                    {org.description || '-'}
                  </Td>
                  <Td className="text-center font-bold text-zinc-700">{memberCount} Orang</Td>
                  <Td>
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/admin/dashboard/organisasi/bagan?id=${org.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100 hover:border-transparent font-bold"
                          icon={<Network className="h-3.5 w-3.5" />}
                        >
                          Atur Struktur
                        </Button>
                      </Link>
                      <button
                        onClick={() => openEditModal(org)}
                        className="p-2 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
                        title="Edit Organisasi"
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrgClick(org)}
                        className="p-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Hapus Organisasi"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Reusable Modal & Form inputs */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? 'Tambah Organisasi Baru' : 'Edit Data Organisasi'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Nama Lembaga"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: PKK Padukuhan Sambeng"
          />
          <TextArea
            label="Deskripsi Ringkas"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan peran/tugas lembaga di tingkat padukuhan..."
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
