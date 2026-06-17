import Image from "next/image";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Layers,
  Home as HomeIcon,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  MessageCircle
} from "lucide-react";
import { getSettings, getNews, getEvents, getUMKM } from "@/lib/db";

export const revalidate = 60; // Revalidate home page every 60 seconds

const iconMap: Record<string, any> = {
  Users: Users,
  ShoppingBag: ShoppingBag,
  Layers: Layers,
  Home: HomeIcon,
};

export default async function Home() {
  const settings = await getSettings();
  const allNews = await getNews();
  const allEvents = await getEvents();
  const allUMKM = await getUMKM();

  // Slice down for homepage showcases
  const latestNews = allNews.slice(0, 3);
  const upcomingEvents = allEvents
    .filter((e) => new Date(e.startDate) >= new Date(Date.now() - 86400000)) // Only future/current events
    .slice(0, 2);
  const featuredUMKM = allUMKM.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[550px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.heroImageUrl || "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=1200&auto=format&fit=crop"}
            alt="Hero Banner Padukuhan Sambeng"
            fill
            priority
            className="object-cover object-center brightness-45"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 bg-primary-600/30 border border-primary-500/50 rounded-full text-xs font-semibold text-primary-200 uppercase tracking-widest mb-4">
            Portal Informasi Digital Resmi
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-md">
            {settings.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 drop-shadow-sm font-light leading-relaxed">
            {settings.heroSubtitle}
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              href="/profil"
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500 transition shadow-lg shadow-primary-700/35"
            >
              Tentang Padukuhan
            </Link>
            <Link
              href="/umkm"
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition backdrop-blur border border-white/20"
            >
              Katalog UMKM
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Statistik Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 -mt-16 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {settings.stats.map((stat, idx) => {
            const IconComponent = iconMap[stat.icon] || Home;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center p-2 ${
                  idx > 1 ? "pt-6 md:pt-2" : ""
                } ${idx > 0 && idx % 2 === 0 ? "pt-6 md:pt-2" : ""}`}
              >
                <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl mb-3">
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Sambutan Dukuh Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-8 ring-primary-50">
                <Image
                  src={settings.dukuhImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"}
                  alt={`Foto Dukuh ${settings.dukuhName}`}
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                Sambutan Kepala Dukuh
              </span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
                {settings.dukuhName}
              </h2>
              <div className="h-1 w-20 bg-primary-600 rounded"></div>
              <p className="text-gray-600 text-lg leading-relaxed italic">
                &ldquo;{settings.dukuhGreeting}&rdquo;
              </p>
              <p className="text-sm font-semibold text-gray-500 uppercase">
                — Dukuh Padukuhan Sambeng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ringkasan Profil Section */}
      <section className="py-20 bg-primary-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sekilas Padukuhan Sambeng</h2>
            <div className="h-1 w-20 bg-primary-600 rounded mx-auto mt-4"></div>
            <p className="mt-4 text-gray-600 text-md leading-relaxed">
              {settings.profileSummary}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 space-y-4 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-primary-800">Visi Kami</h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {settings.profileVision}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 space-y-4 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-primary-800">Misi Kami</h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {settings.profileMission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Berita Terbaru Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Kabar Desa</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-1">Berita & Kegiatan Terbaru</h2>
            </div>
            <Link
              href="/berita"
              className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-600 transition"
            >
              <span>Semua Berita</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {latestNews.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl">Belum ada berita yang dipublikasikan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <article key={news.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition group">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={news.thumbnailUrl}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="inline-block px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase">
                        {news.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition">
                        <Link href={`/berita/${news.slug}`}>{news.title}</Link>
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {news.summary}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 mt-4">
                      <span>Oleh: {news.author}</span>
                      <span>{new Date(news.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Acara Terdekat & UMKM Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Acara Agenda */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Agenda</span>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-1">Acara Mendatang</h2>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500 text-sm">
                  Tidak ada agenda acara terdekat.
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingEvents.map((event) => {
                    const eventDate = new Date(event.startDate);
                    const day = eventDate.getDate();
                    const month = eventDate.toLocaleDateString("id-ID", { month: "short" });
                    return (
                      <div key={event.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex space-x-4 hover:shadow-md transition">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-primary-50 text-primary-700 h-16 w-16 rounded-xl font-bold border border-primary-100">
                          <span className="text-xl leading-none">{day}</span>
                          <span className="text-xs uppercase mt-1">{month}</span>
                        </div>
                        <div className="flex-grow space-y-2">
                          <h3 className="font-bold text-gray-900 line-clamp-1 hover:text-primary-600 transition">
                            {event.title}
                          </h3>
                          <div className="space-y-1 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1.5 text-primary-600" />
                              <span>
                                {eventDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1.5 text-primary-600" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Link
                    href="/acara"
                    className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-600 transition"
                  >
                    <span>Lihat Semua Agenda</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              )}
            </div>

            {/* UMKM Showcase */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Ekonomi Lokal</span>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-1">UMKM Unggulan Warga</h2>
                </div>
                <Link
                  href="/umkm"
                  className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-600 transition"
                >
                  <span>Lihat Katalog</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {featuredUMKM.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500 text-sm">
                  Belum ada UMKM terdaftar.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {featuredUMKM.map((umkm) => (
                    <div key={umkm.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition">
                      <div className="relative h-36 w-full overflow-hidden">
                        <Image
                          src={umkm.imageUrl}
                          alt={umkm.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-primary-700 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded-full">
                            {umkm.category}
                          </span>
                          <h3 className="font-bold text-gray-900 line-clamp-1 mt-2 text-sm hover:text-primary-600 transition">
                            <Link href={`/umkm/${umkm.id}`}>{umkm.name}</Link>
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-1">
                            {umkm.description}
                          </p>
                        </div>
                        <a
                          href={`https://wa.me/${umkm.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-500 transition space-x-1"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Hubungi Penjual</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
