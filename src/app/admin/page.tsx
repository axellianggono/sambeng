"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ShoppingBag,
  Calendar,
  Newspaper,
  Users,
  PlusCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ umkm: 0, news: 0, events: 0, orgs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [umkmSnap, newsSnap, eventsSnap, orgsSnap] = await Promise.all([
          getDocs(collection(db, "umkm")),
          getDocs(collection(db, "news")),
          getDocs(collection(db, "events")),
          getDocs(collection(db, "organizations")),
        ]);
        setCounts({
          umkm: umkmSnap.size,
          news: newsSnap.size,
          events: eventsSnap.size,
          orgs: orgsSnap.size,
        });
      } catch (err) {
        console.error("Failed to load dashboard counts, using defaults:", err);
        // Set mock display if Firestore collections don't exist yet
        setCounts({ umkm: 3, news: 2, events: 2, orgs: 3 });
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { name: "Katalog UMKM", count: counts.umkm, icon: ShoppingBag, color: "bg-emerald-500", href: "/admin/umkm" },
    { name: "Berita & Pengumuman", count: counts.news, icon: Newspaper, color: "bg-sky-500", href: "/admin/berita" },
    { name: "Agenda Acara", count: counts.events, icon: Calendar, color: "bg-amber-500", href: "/admin/acara" },
    { name: "Organisasi Warga", count: counts.orgs, icon: Users, color: "bg-purple-500", href: "/admin/organisasi" },
  ];

  const quickActions = [
    { title: "Tulis Berita Baru", desc: "Buat publikasi berita kegiatan warga", href: "/admin/berita?action=new", icon: Newspaper },
    { title: "Tambah UMKM", desc: "Daftarkan unit usaha baru milik warga", href: "/admin/umkm?action=new", icon: ShoppingBag },
    { title: "Buat Agenda Acara", desc: "Jadwalkan agenda atau kegiatan padukuhan", href: "/admin/acara?action=new", icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ikhtisar Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Selamat datang di sistem manajemen konten Padukuhan Sambeng.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">{card.name}</span>
                <span className="text-3xl font-extrabold text-gray-900 block">{card.count}</span>
                <Link href={card.href} className="text-xs text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center pt-2">
                  <span>Kelola</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
              <div className={`p-4 ${card.color} text-white rounded-2xl shadow-lg shadow-gray-100`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Pintasan Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((act) => {
              const Icon = act.icon;
              return (
                <Link
                  key={act.title}
                  href={act.href}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary-500 hover:shadow-md transition flex flex-col justify-between h-40 group text-left"
                >
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-xl w-fit group-hover:bg-primary-600 group-hover:text-white transition duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">{act.title}</h3>
                    <p className="text-[11px] text-gray-400 leading-normal">{act.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tips Box */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-950 text-primary-100 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Panduan Pengelolaan</h3>
            <p className="text-xs text-primary-200 leading-relaxed">
              Seluruh perubahan yang Anda lakukan di dashboard ini akan langsung ter-update secara real-time di website publik Padukuhan Sambeng. 
            </p>
            <p className="text-xs text-primary-200 leading-relaxed">
              Gunakan rasio gambar landscape untuk banner berita & acara, serta rasio persegi (1:1) untuk foto produk UMKM atau logo organisasi warga.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white text-primary-950 font-bold text-xs rounded-xl hover:bg-primary-50 transition"
          >
            <span>Buka Website Publik</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
