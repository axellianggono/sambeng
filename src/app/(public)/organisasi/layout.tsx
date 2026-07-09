import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organisasi Desa & Lembaga',
  description: 'Informasi struktur organisasi, kepengurusan karang taruna, KIM, dan lembaga kemasyarakatan di Padukuhan Sambeng.',
};

export default function OrganisasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
