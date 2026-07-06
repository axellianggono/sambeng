'use client';

import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Trash2, Eye, Save, CheckCircle } from 'lucide-react';

// UI Components
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Input, TextArea } from '@/components/ui/Input';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Card, CardBody } from '@/components/ui/Card';

// Firestore database service imports
import {
  getContactInfo,
  saveContactInfo,
  getContactMessages,
  deleteContactMessage,
  ContactInfo,
  ContactMessage,
} from '@/lib/db';

export default function AdminKontakPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Modal State
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Confirm Modal State
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
        const info = await getContactInfo();
        const msgs = await getContactMessages();
        setContactInfo(info);
        setMessages(msgs);
      } catch (err) {
        console.error('Gagal memuat data kontak/pesan:', err);
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

  // Save Contact Info
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      await saveContactInfo(contactInfo);
      triggerSaveNotification();
    } catch (err) {
      alert('Gagal menyimpan info kontak');
    } finally {
      setSavingInfo(false);
    }
  };

  // Delete Contact Message
  const handleDeleteMessageClick = (msg: ContactMessage) => {
    setConfirmState({
      isOpen: true,
      title: 'Hapus Pesan Masuk?',
      message: `Apakah Anda yakin ingin menghapus pesan dari "${msg.name}" dengan subjek "${msg.subject}"? Tindakan ini permanen di Firestore!`,
      type: 'danger',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          await deleteContactMessage(msg.id);
          const updatedMsgs = await getContactMessages();
          setMessages(updatedMsgs);
          triggerSaveNotification();
        } catch (err) {
          alert('Gagal menghapus pesan');
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Hubungi Kami & Pesan Masuk</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Kelola informasi alamat/kontak resmi padukuhan dan tinjau pesan masuk dari formulir kontak publik (Firestore Mode).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Edit Contact Info Form */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardBody className="p-6">
              <h3 className="text-base font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span>Info Kontak Balai</span>
              </h3>

              <form onSubmit={handleSaveInfo} className="space-y-4">
                <TextArea
                  label="Alamat Lengkap Balai"
                  required
                  rows={3}
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  placeholder="Masukkan alamat balai padukuhan..."
                  disabled={loading}
                />
                
                <Input
                  label="Nomor WhatsApp/Telepon (Gunakan format angka e.g. 62812...)"
                  required
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="Contoh: 6281234567890"
                  disabled={loading}
                />

                <Input
                  label="Surel / Email Resmi"
                  type="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="Contoh: info@sambeng.desa.id"
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={savingInfo}
                  disabled={loading}
                  icon={<Save className="h-4 w-4" />}
                >
                  Simpan Info Kontak
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Inbox Messages List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-emerald-600" />
              <span>Kotak Masuk Pesan ({messages.length})</span>
            </h3>
          </div>

          <TableContainer>
            <Table>
              <Thead>
                <Th>Pengirim</Th>
                <Th>Subjek</Th>
                <Th>Tanggal Masuk</Th>
                <Th className="text-center">Aksi</Th>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                      Menghubungi Firestore...
                    </Td>
                  </Tr>
                ) : messages.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                      Kotak masuk kosong. Belum ada pesan dari warga.
                    </Td>
                  </Tr>
                ) : (
                  messages.map((msg) => (
                    <Tr key={msg.id}>
                      <Td>
                        <h4 className="font-extrabold text-zinc-800 text-xs sm:text-sm">{msg.name}</h4>
                        <p className="text-[10px] text-zinc-450 mt-0.5">{msg.email}</p>
                      </Td>
                      <Td className="font-semibold text-zinc-700 max-w-[150px] truncate" title={msg.subject}>
                        {msg.subject}
                      </Td>
                      <Td className="text-xs text-zinc-500 font-medium">
                        {new Date(msg.createdAt).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Td>
                      <Td>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="p-2 text-zinc-400 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Baca Pesan Lengkap"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessageClick(msg)}
                            className="p-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Hapus Pesan"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>

      </div>

      {/* Reusable Modal to View Message Details */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Detail Pesan Masuk"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2.5 text-xs">
              <div className="grid grid-cols-3">
                <span className="text-zinc-400 font-bold uppercase">Nama Pengirim</span>
                <span className="col-span-2 text-zinc-850 font-semibold">: {selectedMessage.name}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-zinc-400 font-bold uppercase">Email Pengirim</span>
                <span className="col-span-2 text-zinc-850 font-semibold">: {selectedMessage.email}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-zinc-400 font-bold uppercase">Subjek</span>
                <span className="col-span-2 text-zinc-850 font-semibold">: {selectedMessage.subject}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-zinc-400 font-bold uppercase">Tanggal Kirim</span>
                <span className="col-span-2 text-zinc-850 font-semibold">
                  : {new Date(selectedMessage.createdAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">Isi Pesan</label>
              <div className="p-4 bg-white border border-zinc-250 rounded-2xl text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedMessage(null)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
