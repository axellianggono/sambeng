import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, MapPin, Tag, User } from "lucide-react";
import { getUMKMById } from "@/lib/db";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UMKMDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getUMKMById(id);

  if (!item) {
    notFound();
  }

  // Pre-fill WhatsApp message text
  const encodedText = encodeURIComponent(
    `Halo, saya melihat produk "${item.name}" di Website Padukuhan Sambeng dan tertarik untuk memesan. Apakah produk ini tersedia?`
  );
  const whatsappUrl = `https://wa.me/${item.whatsapp}?text=${encodedText}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/umkm"
          className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-600 transition mb-8 space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Katalog</span>
        </Link>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
          {/* Image Column */}
          <div className="md:col-span-5 relative h-80 md:h-[400px] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={item.imageUrl || "https://images.unsplash.com/photo-1566847438217-76e82d383f84?q=80&w=400&auto=format&fit=crop"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-xl text-xs font-bold text-primary-700 uppercase tracking-wider">
                <Tag className="h-3 w-3" />
                <span>{item.category}</span>
              </span>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {item.name}
              </h1>

              {/* Owner info card */}
              <div className="flex flex-col sm:flex-row gap-4 py-3 border-y border-gray-50 text-sm">
                <div className="flex items-center text-gray-600 space-x-2">
                  <User className="h-4.5 w-4.5 text-primary-600 flex-shrink-0" />
                  <span>Pemilik: <strong className="text-gray-900 font-semibold">{item.owner}</strong></span>
                </div>
                <div className="hidden sm:block text-gray-200">|</div>
                <div className="flex items-center text-gray-600 space-x-2">
                  <MapPin className="h-4.5 w-4.5 text-primary-600 flex-shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deskripsi Usaha</h3>
                <p className="text-gray-600 leading-relaxed text-sm text-justify">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Call Action */}
            <div className="pt-4 border-t border-gray-50">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition shadow-lg shadow-emerald-700/20 space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Hubungi & Pesan Sekarang</span>
              </a>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                *Mengklik tombol ini akan membuka percakapan chat WhatsApp langsung ke pemilik usaha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
