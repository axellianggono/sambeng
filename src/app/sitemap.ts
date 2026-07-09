import { MetadataRoute } from 'next';
import { getNews } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sambeng.vercel.app';

  // Rute Statis
  const staticRoutes = [
    '',
    '/profil',
    '/umkm',
    '/berita',
    '/kontak',
    '/organisasi',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Rute Dinamis dari Firestore (Artikel Berita)
  try {
    const newsList = await getNews();
    const dynamicRoutes = newsList
      .filter((news) => news.isPublished)
      .map((news) => ({
        url: `${baseUrl}/berita/${news.slug}`,
        lastModified: new Date(news.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Gagal membuat sitemap berita:', error);
    return staticRoutes;
  }
}
