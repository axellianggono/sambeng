'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Organization, OrganizationDetail } from '@/lib/dummy-data';
import { Plus, Trash2, Edit, Network, X, ArrowLeft, Save, AlertTriangle } from 'lucide-react';

// React Flow visual imports
import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Component Based imports
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';

// Firestore database imports
import {
  getOrganizations,
  getOrganizationDetails,
  saveOrganizationDetailsForOrg,
} from '@/lib/db';

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

function BaganEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orgId = searchParams.get('id');

  const [org, setOrg] = useState<Organization | null>(null);
  
  // Real database state (stored in Firestore)
  const [globalDetails, setGlobalDetails] = useState<OrganizationDetail[]>([]);
  
  // Local draft state (changes are only written to Firestore when "Simpan Perubahan" is clicked)
  const [draftDetails, setDraftDetails] = useState<OrganizationDetail[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  // Editor states
  const [handlePosition, setHandlePosition] = useState<'top-bottom' | 'left-right'>('top-bottom');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modals Forms
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState<'create' | 'edit'>('create');
  
  // Form State
  const [memberForm, setMemberForm] = useState({
    positionName: '',
    personName: '',
    contact: '',
    parentId: '',
  });

  const [showSavedToast, setShowSavedToast] = useState(false);

  // Custom Confirm Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
  });

  // Load Initial Data
  useEffect(() => {
    if (!orgId) {
      router.push('/admin/dashboard/organisasi');
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const loadedOrgs = await getOrganizations();
        const foundOrg = loadedOrgs.find((o) => o.id === orgId);
        if (foundOrg) {
          setOrg(foundOrg);
        } else {
          router.push('/admin/dashboard/organisasi');
          return;
        }

        const loadedDetails = await getOrganizationDetails();
        setGlobalDetails(loadedDetails);
        setDraftDetails(loadedDetails); // Initialize draft
      } catch (err) {
        console.error('Gagal memuat data bagan dari Firestore:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [orgId, router]);

  const selectedMember = draftDetails.find((m) => m.id === selectedNodeId);
  const orgMembers = draftDetails.filter((m) => m.orgId === orgId);

  // Open Create Member Modal
  const openCreateMemberModal = (prefilledParentId = '') => {
    setMemberForm({
      positionName: '',
      personName: '',
      contact: '',
      parentId: prefilledParentId || selectedNodeId || '',
    });
    setMemberModalMode('create');
    setMemberModalOpen(true);
  };

  // Open Edit Member Modal
  const openEditMemberModal = () => {
    if (!selectedMember) return;
    setMemberForm({
      positionName: selectedMember.positionName,
      personName: selectedMember.personName,
      contact: selectedMember.contact || '',
      parentId: selectedMember.parentId || '',
    });
    setMemberModalMode('edit');
    setMemberModalOpen(true);
  };

  // Form Submit for Member (Create / Update Draft)
  const handleMemberFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.positionName || !memberForm.personName) return;

    if (memberModalMode === 'create') {
      const newObj: OrganizationDetail = {
        id: `od-${Date.now()}`,
        orgId: orgId!,
        positionName: memberForm.positionName,
        personName: memberForm.personName,
        contact: memberForm.contact || undefined,
        parentId: memberForm.parentId === '' ? null : memberForm.parentId,
        order: orgMembers.length + 1,
      };

      const updated = [...draftDetails, newObj];
      setDraftDetails(updated);
      setIsDirty(true);
      setSelectedNodeId(newObj.id); // Inspector auto selects new node
    } else if (memberModalMode === 'edit' && selectedNodeId) {
      const updated = draftDetails.map((d) =>
        d.id === selectedNodeId
          ? {
              ...d,
              positionName: memberForm.positionName,
              personName: memberForm.personName,
              contact: memberForm.contact || undefined,
              parentId: memberForm.parentId === '' ? null : memberForm.parentId,
            }
          : d
      );
      setDraftDetails(updated);
      setIsDirty(true);
    }
    setMemberModalOpen(false);
  };

  // Delete Member (Draft)
  const handleDeleteMemberClick = () => {
    if (!selectedNodeId || !selectedMember) return;

    setConfirmState({
      isOpen: true,
      title: 'Hapus Jabatan/Pengurus?',
      message: `Apakah Anda yakin ingin menghapus "${selectedMember.positionName} - ${selectedMember.personName}" dari bagan? Semua bawahan di bawahnya akan kehilangan atasan (Parent ID menjadi null).`,
      type: 'danger',
      onConfirm: () => {
        const updated = draftDetails
          .filter((d) => d.id !== selectedNodeId)
          .map((d) => (d.parentId === selectedNodeId ? { ...d, parentId: null } : d));
        setDraftDetails(updated);
        setSelectedNodeId(null);
        setIsDirty(true);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Save changes to database (Firestore)
  const handleSaveChanges = () => {
    setConfirmState({
      isOpen: true,
      title: 'Simpan Perubahan ke Database?',
      message: 'Ini akan memperbarui struktur bagan organisasi secara permanen di Firestore dan ter-update langsung di halaman publik. Lanjutkan?',
      type: 'success',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setLoading(true);
        try {
          await saveOrganizationDetailsForOrg(orgId!, draftDetails);
          const loadedDetails = await getOrganizationDetails();
          setGlobalDetails(loadedDetails);
          setDraftDetails(loadedDetails);
          setIsDirty(false);
          setShowSavedToast(true);
          setTimeout(() => setShowSavedToast(false), 3000);
        } catch (err) {
          alert('Gagal menyimpan bagan di Firestore');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Handle Cancel / Go Back
  const handleGoBack = () => {
    if (isDirty) {
      setConfirmState({
        isOpen: true,
        title: 'Buang Perubahan?',
        message: 'Ada perubahan pada bagan struktur organisasi yang belum Anda simpan ke Firestore. Apakah Anda yakin ingin membuangnya dan kembali?',
        type: 'warning',
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          router.push('/admin/dashboard/organisasi');
        },
      });
    } else {
      router.push('/admin/dashboard/organisasi');
    }
  };

  // Helper to build tree structure for React Flow
  const getOrgTree = (): TreeNodeType[] => {
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
    const roots = getOrgTree();
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
      const isTopBottom = handlePosition === 'top-bottom';
      
      const x = isTopBottom 
        ? (leftBound + rightBound) / 2 
        : depth * 220 + 60;
      const y = isTopBottom 
        ? depth * 170 + 40 
        : (leftBound + rightBound) / 2;

      const hasChildren = node.children.length > 0;
      const type = parentId === null ? 'input' : (hasChildren ? 'default' : 'output');
      const isSelected = selectedNodeId === node.id;

      nodes.push({
        id: node.id,
        type,
        position: { x: x - 100, y },
        data: {
          label: (
            <div className="p-1 text-center relative group/node">
              <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                {node.positionName}
              </div>
              <div className="text-xs font-extrabold text-zinc-900 leading-tight">
                {node.personName}
              </div>
              {node.contact && (
                <div className="text-[8px] text-zinc-400 mt-1">
                  WA: {node.contact}
                </div>
              )}
              {/* Plus button inside the node card */}
              <div className="mt-2 pt-1.5 border-t border-zinc-100 flex justify-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    openCreateMemberModal(node.id);
                  }}
                  className="nodrag nopan flex items-center justify-center gap-1 py-0.5 px-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded text-[8px] font-bold transition-all border border-emerald-100 hover:border-transparent cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  title="Tambah Bawahan untuk jabatan ini"
                >
                  <Plus className="h-2.5 w-2.5" />
                  <span>Tambah Bawahan</span>
                </button>
              </div>
            </div>
          ),
        },
        style: {
          background: '#ffffff',
          border: isSelected ? '2px solid #10b981' : '1px solid #d4d4d8',
          borderRadius: '8px',
          padding: '8px',
          width: 200,
          boxShadow: isSelected ? '0 4px 6px -1px rgba(16,185,129,0.15)' : '0 1px 2px 0 rgba(0,0,0,0.05)',
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
            style: { stroke: isSelected || selectedNodeId === child.id ? '#10b981' : '#cbd5e1', strokeWidth: 1.5 },
          });

          traverse(child, depth + 1, currentLeft, childRight, node.id);
          currentLeft = childRight;
        });
      }
    };

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
  }, [orgId, draftDetails, handlePosition, selectedNodeId]);

  return (
    <div className="space-y-6 max-w-7xl relative">
      
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-sm font-semibold">Perubahan bagan berhasil disimpan ke Firestore!</span>
        </div>
      )}

      {/* Reusable ConfirmModal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Editor Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-zinc-100 rounded-xl transition-all border border-zinc-200 text-zinc-650 cursor-pointer"
            title="Kembali ke Daftar Lembaga"
            disabled={loading}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <Network className="h-5 w-5 text-emerald-600" />
              <span>Atur Bagan: {org?.name}</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">
              Penyunting bagan hierarki visual. Data disimpan ke **Firestore** saat menekan Simpan.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 font-bold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>Draft Belum Disimpan</span>
            </span>
          )}
          <Button
            onClick={handleSaveChanges}
            disabled={!isDirty || loading}
            variant="primary"
            size="sm"
            icon={<Save className="h-4 w-4" />}
            isLoading={loading}
          >
            Simpan Bagan
          </Button>
        </div>
      </div>

      {/* Main Split Layout: Left Control Sidebar, Right Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[580px]">
        
        {/* Left Control Sidebar */}
        <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-3xl p-5 flex flex-col gap-6 shadow-sm">
          
          {/* OPTIONS Section */}
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">OPTIONS</h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Handle Positions</span>
                <select
                  value={handlePosition}
                  onChange={(e) => setHandlePosition(e.target.value as any)}
                  className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold cursor-pointer text-zinc-800"
                >
                  <option value="top-bottom">top-bottom</option>
                  <option value="left-right">left-right</option>
                </select>
              </div>
            </div>
          </div>

          {/* NODES & EDGES Section */}
          <div className="border-t border-zinc-150 pt-5 flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">NODES & EDGES</h3>
            
            <button
              onClick={() => openCreateMemberModal()}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              disabled={loading}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add new node</span>
            </button>
          </div>

          {/* NODE INSPECTOR Section */}
          <div className="border-t border-zinc-150 pt-5 flex-1 flex flex-col">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">NODE INSPECTOR</h3>
            
            {loading ? (
              <div className="text-zinc-400 italic text-[11px] leading-relaxed py-6 flex-1 flex items-center justify-center text-center">
                Memuat data...
              </div>
            ) : selectedMember ? (
              <div className="space-y-4 text-xs flex-1 flex flex-col justify-between">
                <div className="space-y-3.5 bg-zinc-50/50 p-4 border border-zinc-200 rounded-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">ID: {selectedMember.id}</span>
                    <button
                      onClick={() => setSelectedNodeId(null)}
                      className="text-[10px] font-bold text-zinc-400 hover:text-zinc-650 flex items-center gap-0.5 cursor-pointer"
                    >
                      Deselect
                    </button>
                  </div>
                  
                  <div>
                    <span className="block text-[8px] font-bold text-zinc-400 uppercase">Jabatan</span>
                    <span className="block text-sm font-bold text-zinc-800 mt-0.5">{selectedMember.positionName}</span>
                  </div>

                  <div>
                    <span className="block text-[8px] font-bold text-zinc-400 uppercase">Pengurus</span>
                    <span className="block text-xs font-semibold text-zinc-700 mt-0.5">{selectedMember.personName}</span>
                  </div>

                  {selectedMember.contact && (
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-400 uppercase">WhatsApp</span>
                      <span className="block text-xs font-medium text-zinc-650 mt-0.5">{selectedMember.contact}</span>
                    </div>
                  )}

                  <div>
                    <span className="block text-[8px] font-bold text-zinc-400 uppercase">Atasan</span>
                    <span className="block text-xs italic text-zinc-500 mt-0.5">
                      {draftDetails.find((d) => d.id === selectedMember.parentId)?.positionName || 'Root (Paling Atas)'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-150 space-y-2">
                  <Button
                    type="button"
                    onClick={openEditMemberModal}
                    variant="outline"
                    className="w-full text-xs font-bold py-1.5 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                  >
                    Ubah Jabatan/Pengurus
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDeleteMemberClick}
                    variant="danger"
                    className="w-full text-xs font-bold py-1.5"
                  >
                    Hapus Jabatan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-zinc-400 italic text-[11px] leading-relaxed py-6 flex-1 flex items-center justify-center text-center bg-zinc-50/50 border border-dashed border-zinc-200 rounded-2xl">
                Select nodes to change their properties
              </div>
            )}
          </div>

        </div>

        {/* Right Canvas Area */}
        <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-3xl p-4 sm:p-5 flex flex-col shadow-sm relative overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm italic">
              Menghubungkan ke Firestore...
            </div>
          ) : flowData.nodes.length > 0 ? (
            <div className="flex-1 min-h-[500px] bg-zinc-50 rounded-2xl border border-zinc-200/80 relative overflow-hidden shadow-inner">
              <ReactFlow
                nodes={flowData.nodes}
                edges={flowData.edges}
                onNodeClick={(_, node) => setSelectedNodeId(node.id)}
                fitView
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
                zoomOnScroll={true}
                panOnDrag={true}
              >
                <Background color="#cbd5e1" gap={16} variant={BackgroundVariant.Dots} />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-zinc-400 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50 italic text-sm">
              Bagan kosong. Silakan gunakan "+ Add new node" di sidebar untuk membuat pengurus utama pertama Anda.
            </div>
          )}
        </div>

      </div>

      {/* Reusable Modal Form for Member */}
      <Modal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        title={memberModalMode === 'create' ? 'Tambah Jabatan/Pengurus Baru' : 'Ubah Jabatan/Pengurus'}
      >
        <form onSubmit={handleMemberFormSubmit} className="space-y-4">
          <Input
            label="Nama Jabatan"
            required
            value={memberForm.positionName}
            onChange={(e) => setMemberForm({ ...memberForm, positionName: e.target.value })}
            placeholder="Contoh: Sekretaris RT 01"
          />
          <Input
            label="Nama Pengurus"
            required
            value={memberForm.personName}
            onChange={(e) => setMemberForm({ ...memberForm, personName: e.target.value })}
            placeholder="Contoh: Heri Sutanto"
          />
          <Input
            label="Nomor WhatsApp (Opsional)"
            value={memberForm.contact}
            onChange={(e) => setMemberForm({ ...memberForm, contact: e.target.value })}
            placeholder="Contoh: 6281234567890"
          />
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">Atasan / Report To</label>
            <select
              value={memberForm.parentId}
              onChange={(e) => setMemberForm({ ...memberForm, parentId: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 cursor-pointer font-medium"
            >
              <option value="">-- Paling Atas (Root) --</option>
              {orgMembers
                .filter((m) => m.id !== selectedNodeId) // Prevent self-referencing in edit mode
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.positionName} ({m.personName})
                  </option>
                ))}
            </select>
          </div>

          <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setMemberModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Terapkan Draft
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default function BaganEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500 italic text-sm">Memuat halaman penyunting bagan...</div>}>
      <BaganEditorContent />
    </Suspense>
  );
}
