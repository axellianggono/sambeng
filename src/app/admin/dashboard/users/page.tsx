'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/lib/dummy-data';
import { Plus, UserPlus, Shield, CheckCircle, Trash2 } from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Component imports
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import { TableContainer, Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

// Firestore database imports
import { getAdminUsers, saveAdminUser, deleteAdminUser } from '@/lib/db';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF' as 'SUPER_ADMIN' | 'STAFF',
    permissions: [] as ('MANAGE_PROFIL' | 'MANAGE_ORGANISASI' | 'MANAGE_UMKM' | 'MANAGE_BERITA' | 'MANAGE_KONTAK')[],
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

  const availablePermissions: { id: typeof formData.permissions[number]; label: string }[] = [
    { id: 'MANAGE_PROFIL', label: 'Kelola Profil Desa' },
    { id: 'MANAGE_ORGANISASI', label: 'Kelola Organisasi' },
    { id: 'MANAGE_UMKM', label: 'Kelola UMKM' },
    { id: 'MANAGE_BERITA', label: 'Kelola Berita' },
    { id: 'MANAGE_KONTAK', label: 'Kelola Hubungi Kami' },
  ];

  // Load from Firestore
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const loadedUsers = await getAdminUsers();
        setUsers(loadedUsers);
      } catch (err) {
        console.error('Gagal memuat data pengguna dari Firestore:', err);
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

  const showAlert = (title: string, message: string, type: 'danger' | 'warning' | 'info' | 'success' = 'warning') => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => setConfirmState((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const handlePermissionChange = (perm: typeof formData.permissions[number]) => {
    if (formData.permissions.includes(perm)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== perm),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, perm],
      });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    if (formData.password.length < 6) {
      showAlert('Kata Sandi Lemah', 'Kata sandi harus minimal 6 karakter!', 'warning');
      return;
    }

    setLoading(true);

    try {
      // 1. Create secondary app to create user in Firebase Auth without logging out current user
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      
      const appName = `SecondaryApp-${Date.now()}`;
      const secondaryApp = initializeApp(firebaseConfig, appName);
      const secondaryAuth = getAuth(secondaryApp);

      const credential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
      const uid = credential.user.uid;
      
      // Sign out secondary auth immediately
      await signOut(secondaryAuth);

      // 2. Create the user profile in Firestore
      const newUser: User = {
        id: uid,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        permissions: formData.role === 'SUPER_ADMIN' 
          ? ['MANAGE_PROFIL', 'MANAGE_ORGANISASI', 'MANAGE_UMKM', 'MANAGE_BERITA', 'MANAGE_KONTAK']
          : formData.permissions,
        createdAt: new Date().toISOString(),
      };

      await saveAdminUser(newUser);
      
      const updated = await getAdminUsers();
      setUsers(updated);
      setFormData({ name: '', email: '', password: '', role: 'STAFF', permissions: [] });
      setShowAddForm(false);
      triggerSaveNotification();
    } catch (err: any) {
      console.error('Gagal membuat user baru:', err);
      // Translate Firebase errors
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        showAlert('Email Sudah Digunakan', 'Email tersebut sudah digunakan oleh akun lain!', 'danger');
      } else if (code === 'auth/weak-password') {
        showAlert('Kata Sandi Lemah', 'Kata sandi terlalu lemah. Silakan masukkan minimal 6 karakter!', 'warning');
      } else {
        showAlert('Gagal Menyimpan', err?.message || 'Gagal menyimpan pengguna baru di Firebase Auth/Firestore', 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    // Get the current logged-in user from localStorage
    const currentUserStr = localStorage.getItem('sambeng_admin_user');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

    if (currentUser && user.id === currentUser.id) {
      showAlert('Aksi Ditolak', 'Anda tidak dapat menghapus akun Anda sendiri!', 'danger');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: 'Hapus Akun Pengguna?',
      message: `Apakah Anda yakin ingin menghapus akun "${user.name}" (${user.email})? Profil admin di Firestore akan dihapus. Catatan: Akun Firebase Authentication perlu dihapus manual melalui Firebase Console.`,
      type: 'danger',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          await deleteAdminUser(user.id);
          const updated = await getAdminUsers();
          setUsers(updated);
          triggerSaveNotification();
        } catch (err) {
          showAlert('Gagal Menghapus', 'Gagal menghapus pengguna dari Firestore', 'danger');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">

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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Kelola Pengguna CMS</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Kelola profil dan hak akses admin yang terdaftar di Firestore. Akun login dibuat melalui Firebase Console → Authentication.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary"
          icon={<UserPlus className="h-4.5 w-4.5" />}
          disabled={loading}
        >
          Tambah Profil Pengguna
        </Button>
      </div>

      {/* Add User Form Drawer/Card */}
      {showAddForm && (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-200 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Tambah Akun Admin Baru</h3>
          <p className="text-xs text-zinc-400 mb-6 -mt-4 leading-relaxed">
            Sistem akan otomatis mendaftarkan email & kata sandi baru ke Firebase Authentication sekaligus mencatat profil hak aksesnya ke Firestore.
          </p>
          <form onSubmit={handleAddUser} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input
                label="Nama Lengkap"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Andi Pratama"
              />
              <Input
                label="Alamat Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="andi@sambeng.desa.id"
              />
              <Input
                label="Kata Sandi (Min. 6 Karakter)"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan kata sandi..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Peran (Role)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 cursor-pointer font-medium"
                >
                  <option value="STAFF">Staff Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              {/* Permissions checkboxes (Only shown for STAFF) */}
              {formData.role === 'STAFF' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Hak Akses Modul</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availablePermissions.map((perm) => (
                      <label
                        key={perm.id}
                        className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer text-xs font-semibold transition-all ${
                          formData.permissions.includes(perm.id)
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.id)}
                          onChange={() => handlePermissionChange(perm.id)}
                          className="sr-only"
                        />
                        <Shield className="h-4 w-4 shrink-0" />
                        <span>{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
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
                Simpan Profil
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Th>Nama</Th>
            <Th>Email / Peran</Th>
            <Th>Izin Akses Modul</Th>
            <Th className="text-center">Aksi</Th>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                  Menghubungi Firestore...
                </Td>
              </Tr>
            ) : users.length === 0 ? (
              <Tr>
                <Td colSpan={4} className="text-center py-12 text-zinc-400 italic">
                  Belum ada profil admin terdaftar di Firestore.
                </Td>
              </Tr>
            ) : (
              users.map((u) => (
                <Tr key={u.id}>
                  <Td className="font-bold text-zinc-800">{u.name}</Td>
                  <Td>
                    <p className="text-zinc-600 font-medium">{u.email}</p>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5 ${
                      u.role === 'SUPER_ADMIN' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                        : 'bg-zinc-100 text-zinc-650'
                    }`}>
                      {u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Staff Admin'}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="text-xs text-zinc-400 italic">Semua Modul Terbuka</span>
                      ) : u.permissions.length > 0 ? (
                        u.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[10px] font-semibold"
                          >
                            {p.replace('MANAGE_', '')}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-400 text-xs italic">Tanpa Akses Modul</span>
                      )}
                    </div>
                  </Td>
                  <Td className="text-center">
                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="p-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus Profil Pengguna"
                      disabled={loading}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}
