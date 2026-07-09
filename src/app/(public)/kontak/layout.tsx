import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Kirim pesan, saran, atau pertanyaan kepada pengurus Padukuhan Sambeng melalui formulir kontak resmi.',
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
