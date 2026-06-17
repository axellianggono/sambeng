import Image from "next/image";
import { Users, ShoppingBag, Layers, Home, Award, BookOpen, Compass } from "lucide-react";
import { getSettings } from "@/lib/db";

export const revalidate = 60;

const iconMap: Record<string, any> = {
  Users: Users,
  ShoppingBag: ShoppingBag,
  Layers: Layers,
  Home: Home,
};

export default async function ProfilPage() {
  const settings = await getSettings();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="relative bg-primary-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={settings.heroImageUrl}
            alt="Background Padukuhan Sambeng"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Profil Padukuhan Sambeng</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-200">
            Kenali lebih dekat sejarah, visi misi, serta demografi Padukuhan Sambeng.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 sm:px-6 lg:px-8 space-y-16">
        {/* Sejarah Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="p-6 bg-primary-50 rounded-full text-primary-600">
              <BookOpen className="h-20 w-20" />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">Latar Belakang</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Sejarah Padukuhan</h2>
            <div className="h-1 w-16 bg-primary-600 rounded"></div>
            <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {settings.profileHistory}
            </p>
          </div>
        </section>

        {/* Visi Misi Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 space-y-4 flex flex-col items-start hover:shadow-md transition">
            <div className="p-3 bg-secondary-50 text-secondary-600 rounded-xl">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Visi Utama</h3>
            <div className="h-1 w-12 bg-secondary-500 rounded"></div>
            <p className="text-gray-600 text-lg leading-relaxed pt-2">
              {settings.profileVision}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 space-y-4 flex flex-col items-start hover:shadow-md transition">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Misi Pembangunan</h3>
            <div className="h-1 w-12 bg-primary-600 rounded"></div>
            <div className="text-gray-600 leading-relaxed pt-2 whitespace-pre-line">
              {settings.profileMission}
            </div>
          </div>
        </section>

        {/* Statistik Demografi Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Data & Statistik Wilayah</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Statistik demografis kependudukan dan kegiatan warga di lingkungan Padukuhan Sambeng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.stats.map((stat, idx) => {
              const IconComponent = iconMap[stat.icon] || Home;
              return (
                <div key={idx} className="bg-gray-50/70 hover:bg-gray-50 rounded-xl p-6 border border-gray-100 flex items-center space-x-4 transition">
                  <div className="p-3 bg-white text-primary-600 rounded-xl shadow-sm border border-gray-50">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
