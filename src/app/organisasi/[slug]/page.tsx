import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, Compass, PhoneCall, Users } from "lucide-react";
import { getOrganizationBySlug } from "@/lib/db";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface StructureNode {
  id: string;
  name: string;
  role: string;
  parentId: string | null;
}

function TreeNodeComponent({
  node,
  allNodes,
}: {
  node: StructureNode;
  allNodes: StructureNode[];
}) {
  const children = allNodes.filter((n) => n.parentId === node.id);

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className="bg-white px-5 py-4 rounded-xl border border-primary-100 shadow-sm text-center min-w-[170px] max-w-[240px] relative z-10 hover:border-primary-400 hover:shadow transition duration-200">
        <div className="text-[10px] text-primary-700 font-bold uppercase tracking-wider mb-1">
          {node.role}
        </div>
        <div className="text-sm font-bold text-gray-900 leading-tight">
          {node.name}
        </div>
      </div>

      {children.length > 0 && (
        <div className="relative flex flex-col items-center mt-6">
          {/* Vertical line connecting node to children */}
          <div className="absolute top-0 w-0.5 h-6 bg-primary-200 -mt-6"></div>

          {/* Children row */}
          <div className="flex gap-8 pt-6 relative justify-center">
            {/* Horizontal line linking children together */}
            {children.length > 1 && (
              <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-primary-200"></div>
            )}
            
            {/* Individual child line connector */}
            {children.map((child) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="absolute top-0 w-0.5 h-6 bg-primary-200 -mt-6"></div>
                <TreeNodeComponent node={child} allNodes={allNodes} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function OrganisasiDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);

  if (!org) {
    notFound();
  }

  // Find root nodes of the hierarchy
  const rootNodes = org.structure.filter(
    (node) => !node.parentId || !org.structure.some((n) => n.id === node.parentId)
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-primary-900 text-white py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center sm:justify-between space-y-6 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Link
              href="/organisasi"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="text-xs text-primary-200 font-bold uppercase tracking-widest">Detail Organisasi</span>
              <h1 className="text-3xl font-extrabold tracking-tight mt-1">{org.name}</h1>
            </div>
          </div>
          <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-sm">
            <PhoneCall className="h-4 w-4 mr-2 text-primary-300" />
            <span>Kontak: {org.contact}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 sm:px-6 lg:px-8 space-y-12">
        {/* Deskripsi & Visi Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tentang Organisasi</h2>
              <div className="h-1 w-10 bg-primary-600 rounded"></div>
            </div>
            <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {org.description}
            </p>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-primary-700 font-bold text-sm uppercase tracking-wider">
                <Compass className="h-4 w-4" />
                <span>Visi</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{org.vision}</p>
            </div>
            <div className="h-px bg-gray-100"></div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-primary-700 font-bold text-sm uppercase tracking-wider">
                <Award className="h-4 w-4" />
                <span>Misi</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{org.mission}</p>
            </div>
          </div>
        </div>

        {/* Struktur Organisasi Tree */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bagan Struktur Organisasi</h2>
              <p className="text-xs text-gray-500 mt-0.5">Hierarki kepengurusan lembaga yang berlaku</p>
            </div>
          </div>
          
          <div className="h-px bg-gray-100"></div>

          {rootNodes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Struktur organisasi belum dimasukkan.</div>
          ) : (
            <div className="w-full overflow-x-auto py-8">
              <div className="min-w-[700px] flex flex-col items-center space-y-12">
                {rootNodes.map((rootNode) => (
                  <TreeNodeComponent
                    key={rootNode.id}
                    node={rootNode}
                    allNodes={org.structure}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
