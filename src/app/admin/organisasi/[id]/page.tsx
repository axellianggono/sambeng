"use client";

import { use, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Organization } from "@/lib/data-defaults";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Users, Loader2, GitMerge } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface StructureNode {
  id: string;
  name: string;
  role: string;
  parentId: string | null;
}

export default function AdminOrganisasiBaganPage({ params }: PageProps) {
  const { id } = use(params);
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states for adding/editing a member node
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  const loadOrg = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "organizations", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrg({ id: docSnap.id, ...docSnap.data() } as Organization);
      }
    } catch (err) {
      console.error("Failed to load organization details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrg();
  }, [id]);

  const handleOpenNewForm = () => {
    setCurrentNodeId(null);
    setName("");
    setRole("");
    setParentId(""); // empty string will translate to null
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (node: StructureNode) => {
    setCurrentNodeId(node.id);
    setName(node.name);
    setRole(node.role);
    setParentId(node.parentId || "");
    setIsFormOpen(true);
  };

  const handleSubmitNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;

    setSaving(true);
    let updatedStructure = [...(org.structure || [])];
    const cleanedParentId = parentId === "" ? null : parentId;

    if (currentNodeId) {
      // Edit Mode
      updatedStructure = updatedStructure.map((node) =>
        node.id === currentNodeId
          ? { ...node, name, role, parentId: cleanedParentId }
          : node
      );
    } else {
      // Add Mode
      const newNode: StructureNode = {
        id: "node-" + Date.now(),
        name,
        role,
        parentId: cleanedParentId,
      };
      updatedStructure.push(newNode);
    }

    try {
      await setDoc(doc(db, "organizations", id), {
        ...org,
        structure: updatedStructure,
      });
      setOrg({ ...org, structure: updatedStructure });
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui struktur.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNode = async (nodeId: string) => {
    if (!org) return;
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) return;

    setSaving(true);
    // Find children of this node and update their parentId to null or link to this node's parent
    const targetNode = org.structure.find((n) => n.id === nodeId);
    const updatedStructure = org.structure
      .filter((node) => node.id !== nodeId)
      .map((node) =>
        node.parentId === nodeId
          ? { ...node, parentId: targetNode?.parentId || null }
          : node
      );

    try {
      await setDoc(doc(db, "organizations", id), {
        ...org,
        structure: updatedStructure,
      });
      setOrg({ ...org, structure: updatedStructure });
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus anggota.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="bg-white p-8 text-center rounded-2xl border border-gray-100">
        <p className="text-gray-500">Organisasi tidak ditemukan.</p>
        <Link href="/admin/organisasi" className="text-primary-600 font-semibold underline mt-2 block">
          Kembali ke daftar
        </Link>
      </div>
    );
  }

  // Filter out the current node from parent options to prevent recursive parenting loops
  const parentOptions = (org.structure || []).filter(
    (node) => !currentNodeId || node.id !== currentNodeId
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/organisasi"
            className="p-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-xl transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="text-xs text-primary-700 font-bold uppercase tracking-wider">
              Bagan Struktur & Pengurus
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">{org.name}</h1>
          </div>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleOpenNewForm}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md transition w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Anggota</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        /* Node Editor Form Overlay */
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {currentNodeId ? "Edit Anggota Bagan" : "Tambah Anggota Bagan Baru"}
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitNode} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-gray-700">Nama Anggota Pengurus</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Contoh: Bapak Maryono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700">Jabatan / Peran</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Contoh: Dukuh, Ketua, Wakil Ketua, Humas, Anggota"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700">Atasan / Parent Node (Bagan Tingkat Atasnya)</label>
              <select
                value={parentId || ""}
                onChange={(e) => setParentId(e.target.value)}
                className="mt-1 block w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="">Tidak ada (Tingkat Paling Atas / Root)</option>
                {parentOptions.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.role} - {node.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1">
                Pilih pemimpin langsung dari anggota ini untuk membentuk susunan hierarki pohon diagram.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-2 px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-xl transition"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Anggota</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Bagan listings */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <div className="flex items-center space-x-2.5 text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
            <GitMerge className="h-4 w-4 text-primary-600" />
            <span>Daftar Pengurus Lembaga</span>
          </div>

          {!org.structure || org.structure.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Bagan struktur masih kosong. Klik "+ Tambah Anggota" untuk mendaftarkan pengurus pertama (contoh: Dukuh/Ketua).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4">Nama Pengurus</th>
                    <th className="p-4">Jabatan</th>
                    <th className="p-4">Pemimpin (Parent)</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {org.structure.map((node) => {
                    const parent = org.structure.find((n) => n.id === node.parentId);
                    return (
                      <tr key={node.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-semibold text-gray-900">{node.name}</td>
                        <td className="p-4">
                          <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase">
                            {node.role}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {parent ? (
                            <span>{parent.role} ({parent.name})</span>
                          ) : (
                            <span className="text-gray-400 font-semibold italic">Tingkat Paling Atas</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditForm(node)}
                            className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                            title="Edit Anggota"
                          >
                            <Edit className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNode(node.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Anggota"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
