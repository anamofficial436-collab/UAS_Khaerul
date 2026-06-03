"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pengaduan, StatusPengaduan, STATUS_LABELS } from "@/types";
import { Eye, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

export default function PengaduanActions({ pengaduan }: { pengaduan: Pengaduan }) {
  const router = useRouter();
  const toast = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusPengaduan>(pengaduan.status);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setUpdateLoading(true);
    try {
      const res = await fetch(`/api/pengaduan/${pengaduan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status diubah menjadi "${STATUS_LABELS[selectedStatus]}"`);
        setEditOpen(false);
        router.refresh();
      } else {
        toast.error(data.error || "Gagal mengubah status");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/pengaduan/${pengaduan.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Pengaduan berhasil dihapus");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(data.error || "Gagal menghapus pengaduan");
        setDeleteOpen(false);
      }
    } catch {
      toast.error("Gagal terhubung ke server");
      setDeleteOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Link
          href={`/dashboard/pengaduan/detail/${pengaduan.id}`}
          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="Lihat Detail"
        >
          <Eye size={15} />
        </Link>
        <button
          onClick={() => setEditOpen(true)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Status"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Edit Status Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Edit Status Pengaduan</h3>
              <button onClick={() => setEditOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={16} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4 border-l-2 border-primary-200 pl-3 line-clamp-2">
              {pengaduan.judul}
            </p>

            <div className="mb-5">
              <label className="label">Status Baru</label>
              <select
                className="input-field"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as StatusPengaduan)}
              >
                {(["menunggu", "diproses", "selesai"] as StatusPengaduan[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                disabled={updateLoading || selectedStatus === pengaduan.status}
                className="btn-primary flex-1 justify-center py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateLoading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Simpan Perubahan
              </button>
              <button onClick={() => setEditOpen(false)} className="btn-secondary px-4 py-2.5">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Pengaduan?"
        description={`Pengaduan "${pengaduan.judul}" akan dihapus permanen dan tidak dapat dipulihkan.`}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
