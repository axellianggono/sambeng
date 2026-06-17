import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, PhoneCall } from "lucide-react";
import { getOrganizations } from "@/lib/db";

export const revalidate = 60;

export default async function OrganisasiListPage() {
  const organizations = await getOrganizations();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Organisasi & Lembaga</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-200">
            Daftar lembaga kemasyarakatan yang aktif membangun Padukuhan Sambeng.
          </p>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-16 sm:px-6 lg:px-8">
        {organizations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-500">
            Belum ada organisasi yang didaftarkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  {/* Banner/Header style with logo overlap */}
                  <div className="h-24 bg-gradient-to-r from-primary-700 to-primary-800 relative">
                    <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl overflow-hidden bg-white border-2 border-white shadow-md">
                      <Image
                        src={org.logoUrl || "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=200&auto=format&fit=crop"}
                        alt={`Logo ${org.name}`}
                        width={64}
                        height={64}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="p-6 pt-10 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition">
                      {org.name}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {org.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex flex-col space-y-3">
                  <div className="flex items-center text-xs text-gray-500 space-x-1.5">
                    <PhoneCall className="h-3 w-3 text-primary-600" />
                    <span className="truncate">{org.contact}</span>
                  </div>
                  <Link
                    href={`/organisasi/${org.slug}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-500 transition space-x-1"
                  >
                    <span>Struktur & Visi Misi</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
