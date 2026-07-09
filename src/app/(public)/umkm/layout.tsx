import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UMKM & Produk Unggulan',
  description: 'Dukung usaha lokal masyarakat Padukuhan Sambeng. Jelajahi berbagai jenis usaha kuliner, pertanian, kerajinan, dan jasa.',
};

export default function UMKMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
