import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { getNewsBySlug } from "@/lib/db";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const publishDate = new Date(news.publishedAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/berita"
          className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-600 transition mb-8 space-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Berita</span>
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10 space-y-8">
          {/* Metadata Header */}
          <div className="space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-xl text-xs font-bold text-primary-700 uppercase tracking-wider">
              <Tag className="h-3 w-3" />
              <span>{news.category}</span>
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {news.title}
            </h1>

            {/* Author and Date */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2 border-t border-gray-50">
              <div className="flex items-center space-x-1.5">
                <User className="h-4 w-4 text-primary-600" />
                <span>Ditulis oleh: <strong className="text-gray-800 font-semibold">{news.author}</strong></span>
              </div>
              <div className="text-gray-200">|</div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4 text-primary-600" />
                <span>{publishDate}</span>
              </div>
            </div>
          </div>

          {/* Large Thumbnail */}
          <div className="relative h-64 md:h-[400px] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src={news.thumbnailUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop"}
              alt={news.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Rich content body */}
          <div
            className="rich-content text-gray-700 leading-relaxed text-justify whitespace-pre-line text-md"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </article>
      </div>
    </div>
  );
}
