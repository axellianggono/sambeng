import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Berita & Pengumuman',
  description: 'Kabar terbaru, pengumuman penting, liputan kegiatan warga, dan warta resmi Padukuhan Sambeng.',
};

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
