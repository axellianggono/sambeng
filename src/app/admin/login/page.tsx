'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Landmark, LogIn, AlertCircle } from 'lucide-react';
import { loginAdmin } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const user = await loginAdmin(email, password);
      // Simpan profil user di localStorage sebagai cache sesi
      localStorage.setItem('sambeng_admin_user', JSON.stringify(user));
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Login gagal:', err);

      // Translate Firebase error codes to Indonesian messages
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Email atau kata sandi tidak ditemukan. Pastikan akun sudah didaftarkan di Firebase Authentication.');
      } else if (code === 'auth/wrong-password') {
        setError('Kata sandi salah. Silakan coba lagi.');
      } else if (code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan login. Silakan tunggu beberapa saat dan coba lagi.');
      } else if (code === 'auth/invalid-email') {
        setError('Format alamat email tidak valid.');
      } else {
        setError(err?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl mb-4">
            <Landmark className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Portal Admin</h1>
          <p className="text-sm text-zinc-500 mt-1">Padukuhan Sambeng, Desa Ngalang</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-100/80 rounded-2xl text-xs space-y-1 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
              <p className="font-semibold leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sambeng.desa.id"
                className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 transition-all font-medium"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Menghubungkan ke Firebase...</span>
            ) : (
              <>
                <LogIn className="h-4.5 w-4.5" />
                <span>Masuk Ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Info footer */}
        <p className="mt-6 text-center text-[10px] text-zinc-400 font-medium leading-relaxed">
          Akun admin didaftarkan melalui Firebase Console → Authentication.<br />
          Hubungi pengelola proyek jika belum memiliki akun.
        </p>
      </div>
    </div>
  );
}
