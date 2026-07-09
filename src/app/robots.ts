import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sambeng.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Melarang crawler merayapi dashboard admin
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
