import { getNews } from "@/lib/db";
import NewsListClient from "./NewsListClient";

export const revalidate = 60;

export default async function BeritaPage() {
  const newsList = await getNews();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Kabar & Berita Kegiatan</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-200">
            Ikuti informasi terkini, pengumuman resmi, dan dokumentasi kegiatan di Padukuhan Sambeng.
          </p>
        </div>
      </div>

      {/* Main Container wrapping NewsListClient */}
      <div className="max-w-6xl mx-auto px-4 mt-12 sm:px-6 lg:px-8">
        <NewsListClient initialNews={newsList} />
      </div>
    </div>
  );
}
