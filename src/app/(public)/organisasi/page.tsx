'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { getOrganizations, getOrganizationDetails } from '@/lib/db';
import { Organization, OrganizationDetail } from '@/lib/dummy-data';
import { Users, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface TreeNodeType extends OrganizationDetail {
  children: TreeNodeType[];
}

interface FlowNode {
  id: string;
  type: string;
  data: { label: React.ReactNode };
  position: { x: number; y: number };
  style?: React.CSSProperties;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  style?: React.CSSProperties;
}

export default function OrganisasiPage() {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [details, setDetails] = useState<OrganizationDetail[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Firestore
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const loadedOrgs = await getOrganizations();
        const loadedDetails = await getOrganizationDetails();
        setOrgs(loadedOrgs);
        setDetails(loadedDetails);
      } catch (err) {
        console.error('Gagal memuat data organisasi di halaman publik:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper to build tree
  const getOrgTree = (orgId: string): TreeNodeType[] => {
    const orgMembers = details.filter((m) => m.orgId === orgId);
    
    const buildTree = (parentId: string | null): TreeNodeType[] => {
      return orgMembers
        .filter((m) => m.parentId === parentId)
        .sort((a, b) => a.order - b.order)
        .map((m) => ({
          ...m,
          children: buildTree(m.id),
        }));
    };

    return buildTree(null);
  };

  // Memoized nodes and edges for React Flow
  const flowData = useMemo(() => {
    if (!selectedOrg) return { nodes: [], edges: [] };
    
    const roots = getOrgTree(selectedOrg.id);
    if (roots.length === 0) return { nodes: [], edges: [] };

    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];

    // Helper to calculate total subtree width
    const getSubtreeWidth = (node: TreeNodeType): number => {
      if (node.children.length === 0) return 1;
      return node.children.reduce((acc, c) => acc + getSubtreeWidth(c), 0);
    };

    const traverse = (
      node: TreeNodeType,
      depth: number,
      leftBound: number,
      rightBound: number,
      parentId: string | null
    ) => {
      const x = (leftBound + rightBound) / 2;
      const y = depth * 140 + 40;

      const hasChildren = node.children.length > 0;
      const type = parentId === null ? 'input' : (hasChildren ? 'default' : 'output');

      nodes.push({
        id: node.id,
        type,
        position: { x: x - 100, y }, // Center the 200px wide node
        data: {
          label: (
            <div className="p-1">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                {node.positionName}
              </div>
              <div className="text-xs font-extrabold text-zinc-900 leading-tight">
                {node.personName}
              </div>
              {node.contact && (
                <a
                  href={`https://wa.me/${node.contact}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="nodrag nopan mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <Phone className="h-3 w-3 shrink-0" />
                  <span>Hubungi (WA)</span>
                </a>
              )}
            </div>
          ),
        },
        style: {
          background: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '12px',
          padding: '10px',
          width: 200,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
        },
      });

      if (hasChildren) {
        const totalWidth = getSubtreeWidth(node);
        let currentLeft = leftBound;

        node.children.forEach((child) => {
          const childWidth = getSubtreeWidth(child);
          const ratio = childWidth / totalWidth;
          const childRight = currentLeft + (rightBound - leftBound) * ratio;

          edges.push({
            id: `e-${node.id}-${child.id}`,
            source: node.id,
            target: child.id,
            type: 'smoothstep',
            style: { stroke: '#10b981', strokeWidth: 2 },
          });

          traverse(child, depth + 1, currentLeft, childRight, node.id);
          currentLeft = childRight;
        });
      }
    };

    // Calculate total layout width based on leaf count of all roots
    const totalRootsWidth = roots.reduce((acc, r) => acc + getSubtreeWidth(r), 0);
    let left = 0;
    const totalCanvasWidth = Math.max(totalRootsWidth * 250, 800);

    roots.forEach((root) => {
      const rootWidth = getSubtreeWidth(root);
      const right = left + (rootWidth / totalRootsWidth) * totalCanvasWidth;
      traverse(root, 0, left, right, null);
      left = right;
    });

    return { nodes, edges };
  }, [selectedOrg]);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button if an organization is selected */}
        {selectedOrg && (
          <button
            onClick={() => setSelectedOrg(null)}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Organisasi</span>
          </button>
        )}

        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            {selectedOrg ? selectedOrg.name : 'Organisasi Padukuhan'}
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            {selectedOrg
              ? selectedOrg.description
              : 'Struktur dan kepengurusan berbagai lembaga kemasyarakatan di Padukuhan Sambeng.'}
          </p>
        </div>

        {/* Conditional Rendering */}
        {loading ? (
          <div className="text-center py-20 text-zinc-500 italic">
            Memuat data organisasi...
          </div>
        ) : !selectedOrg ? (
          /* Organization List View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {orgs.map((org) => (
              <div
                key={org.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="p-3 w-fit bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-6">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                    {org.name}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                    {org.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrg(org)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-semibold text-sm transition-colors border border-emerald-200/55 cursor-pointer"
                >
                  <span>Lihat Struktur Organisasi</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
            {orgs.length === 0 && (
              <div className="col-span-full text-center py-20 text-zinc-400 italic">
                Belum ada data organisasi terdaftar.
              </div>
            )}
          </div>
        ) : (
          /* Tree View Structure using React Flow */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm overflow-hidden">
            {flowData.nodes.length > 0 ? (
              <div className="h-[550px] w-full bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 relative">
                <ReactFlow
                  nodes={flowData.nodes}
                  edges={flowData.edges}
                  fitView
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  zoomOnScroll={true}
                  panOnDrag={true}
                >
                  <Background color="#cbd5e1" gap={16} />
                  <Controls showInteractive={false} />
                </ReactFlow>
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-400">
                Belum ada data anggota struktur organisasi ini.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
