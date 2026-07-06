'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { getContactInfo, saveContactMessage, ContactInfo, ContactMessage } from '@/lib/db';

export default function KontakPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: 'Sambeng, Kelurahan Ngalang, Kapanewon Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55861',
    phone: '6281234567890',
    email: 'info@sambeng.desa.id',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load live contact info
  useEffect(() => {
    async function loadInfo() {
      try {
        const info = await getContactInfo();
        setContactInfo(info);
      } catch (err) {
        console.error('Gagal memuat info kontak publik:', err);
      }
    }
    loadInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;
    setLoading(true);

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveContactMessage(newMessage);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Hubungi Kami
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Punya pertanyaan atau masukan untuk Padukuhan Sambeng? Jangan ragu untuk mengirim pesan kepada kami melalui formulir di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Info Details Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Address */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-950 dark:text-white text-base mb-1">Alamat Balai</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {contactInfo.address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-950 dark:text-white text-base mb-1">Nomor Telepon</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  +{contactInfo.phone}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">Senin - Jumat, 08.00 - 15.00 WIB</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-950 dark:text-white text-base mb-1">Surel Resmi</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 transition-colors">
                  {contactInfo.email}
                </p>
              </div>
            </div>

          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Kirim Pesan</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-900 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" />
                <span className="text-sm font-semibold">Pesan Anda berhasil dikirim! Terima kasih atas dukungannya.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all"
                    placeholder="Contoh: Budi Pratama"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase mb-2">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all"
                    placeholder="budi@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase mb-2">Subjek Pesan</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all"
                  placeholder="Contoh: Pertanyaan UMKM"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase mb-2">Isi Pesan</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all resize-none"
                  placeholder="Ketikkan pesan atau masukan Anda di sini..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Kirim Pesan</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm overflow-hidden h-96">
          {/* We embed Google Maps with iframe */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15809.835478479532!2d110.5562862828628!3d-7.846950294101111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a4b08ffdf060b%3A0xe54ad45187fa54d8!2sNgalang%2C%20Gedangsari%2C%20Gunung%20Kidul%20Regency%2C%20Special%20Region%20of%20Yogyakarta!5e0!3m2!1sen!2sid!4v1717627142000!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1.25rem' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </div>
  );
}
