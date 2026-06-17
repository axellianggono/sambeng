import { getUMKM } from "@/lib/db";
import UMKMCatalogClient from "./UMKMCatalogClient";

export const revalidate = 60;

export default async function UMKMPage() {
  const umkmItems = await getUMKM();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Katalog UMKM Warga</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-200">
            Dukung ekonomi lokal dengan membeli produk unggulan karya warga Padukuhan Sambeng.
          </p>
        </div>
      </div>

      {/* Main Container wrapping Interactive Client Component */}
      <div className="max-w-6xl mx-auto px-4 mt-12 sm:px-6 lg:px-8">
        <UMKMCatalogClient initialItems={umkmItems} />
      </div>
    </div>
  );
}
