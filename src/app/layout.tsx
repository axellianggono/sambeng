import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sambeng.vercel.app'),
  title: {
    default: "Padukuhan Sambeng - Portal Resmi Desa Ngalang, Gunungkidul",
    template: "%s | Padukuhan Sambeng"
  },
  description: "Portal resmi Padukuhan Sambeng, Kalurahan Ngalang, Kapanewon Gedangsari, Kabupaten Gunungkidul. Pusat informasi kegiatan warga, profil padukuhan, dan produk unggulan UMKM.",
  keywords: ["Sambeng", "Padukuhan Sambeng", "Desa Ngalang", "Ngalang Gedangsari", "Gunungkidul", "Portal Desa", "UMKM Sambeng", "Gedangsari"],
  authors: [{ name: "KKN Sambeng" }],
  openGraph: {
    title: "Padukuhan Sambeng - Portal Resmi",
    description: "Portal resmi Padukuhan Sambeng, Kalurahan Ngalang, Gedangsari, Gunungkidul.",
    url: "https://sambeng.vercel.app",
    siteName: "Padukuhan Sambeng",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Padukuhan Sambeng - Portal Resmi",
    description: "Portal resmi Padukuhan Sambeng, Kalurahan Ngalang, Gedangsari, Gunungkidul.",
  },
  verification: {
    google: "pAk0-vnr_daBsI6WKYK6iKSWGvScMMkEd_7fkpnjBc0",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
